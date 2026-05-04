import React, { useRef, useEffect, useCallback, useState } from 'react';
import type { DrawingStroke, Point, ToolType } from './types.ts';

interface DrawCanvasProps {
    tool: ToolType;
    activeColor: string;
    strokes: DrawingStroke[];
    onStrokeComplete: (stroke: DrawingStroke) => void;
    onEraserAction: (x: number, y: number) => void;
}

export const DrawCanvas: React.FC<DrawCanvasProps> = ({
    tool, activeColor, strokes, onStrokeComplete, onEraserAction
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const activeCanvasRef = useRef<HTMLCanvasElement>(null);
    const [currentStroke, setCurrentStroke] = useState<Point[] | null>(null);
    const [currentStrokeItemId, setCurrentStrokeItemId] = useState<string | undefined>(undefined);

    // Resize handler
    const resizeCanvas = useCallback(() => {
        const container = canvasRef.current?.parentElement;
        if (!container) return;

        const width = container.clientWidth;
        const height = Math.max(document.documentElement.scrollHeight, window.innerHeight);

        [canvasRef, activeCanvasRef].forEach(ref => {
            if (ref.current) {
                ref.current.width = width;
                ref.current.height = height;
            }
        });
    }, []);

    useEffect(() => {
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        return () => window.removeEventListener('resize', resizeCanvas);
    }, [resizeCanvas]);

    // Utility to draw a smooth stroke
    const drawStrokeOnCtx = (ctx: CanvasRenderingContext2D, s: DrawingStroke) => {
        if (s.points.length < 2) return;
        let offsetY = 0;
        if (s.itemId) {
            const itemEl = document.getElementById(`slide-${s.itemId}`);
            if (itemEl) offsetY = itemEl.getBoundingClientRect().top + window.scrollY;
        }

        ctx.beginPath();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.globalAlpha = s.opacity || 1;
        ctx.strokeStyle = s.color;

        ctx.moveTo(s.points[0].x, s.points[0].y + offsetY);

        for (let i = 1; i < s.points.length - 2; i++) {
            const p = s.points[i];
            const next = s.points[i + 1];
            const midX = (p.x + next.x) / 2;
            const midY = (p.y + next.y) / 2;
            ctx.lineWidth = s.width * (p.p || 1);
            ctx.quadraticCurveTo(p.x, p.y + offsetY, midX, midY + offsetY);
        }

        if (s.points.length > 2) {
            const last = s.points[s.points.length - 1];
            const secondLast = s.points[s.points.length - 2];
            ctx.quadraticCurveTo(secondLast.x, secondLast.y + offsetY, last.x, last.y + offsetY);
        } else {
            ctx.lineTo(s.points[1].x, s.points[1].y + offsetY);
        }
        ctx.stroke();
    };

    const renderBackground = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        strokes.forEach(s => drawStrokeOnCtx(ctx, s));
    }, [strokes]);

    useEffect(() => { renderBackground(); }, [renderBackground]);

    // Active stroke rendering
    useEffect(() => {
        const canvas = activeCanvasRef.current;
        if (!canvas || !currentStroke) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawStrokeOnCtx(ctx, {
            points: currentStroke,
            color: activeColor,
            width: tool === 'highlighter' ? 30 : 4,
            opacity: tool === 'highlighter' ? 0.4 : 1,
            itemId: currentStrokeItemId
        });
    }, [currentStroke, activeColor, tool, currentStrokeItemId]);

    const handlePointerDown = (e: React.PointerEvent) => {
        if (tool === 'eraser') onEraserAction(e.clientX, e.clientY);
        else if (tool !== 'laser' && tool !== 'dictionary') {
            const slideEl = document.elementsFromPoint(e.clientX, e.clientY).find(el => el.id && el.id.startsWith('slide-'));
            const itemId = slideEl?.id.replace('slide-', '');
            let startPos = { x: e.clientX, y: e.clientY + window.scrollY, p: e.pressure || 1 };

            if (itemId) {
                const rect = slideEl!.getBoundingClientRect();
                startPos = { x: e.clientX, y: (e.clientY + window.scrollY) - (rect.top + window.scrollY), p: e.pressure || 1 };
                setCurrentStrokeItemId(itemId);
            } else setCurrentStrokeItemId(undefined);

            setCurrentStroke([startPos]);
            (e.target as Element).setPointerCapture(e.pointerId);
        }
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (tool === 'eraser' && currentStroke) onEraserAction(e.clientX, e.clientY);
        else if (currentStroke) {
            let pos = { x: e.clientX, y: e.clientY + window.scrollY, p: e.pressure || 1 };
            if (currentStrokeItemId) {
                const itemEl = document.getElementById(`slide-${currentStrokeItemId}`);
                if (itemEl) {
                    const rect = itemEl.getBoundingClientRect();
                    pos = { x: e.clientX, y: (e.clientY + window.scrollY) - (rect.top + window.scrollY), p: e.pressure || 1 };
                }
            }
            setCurrentStroke(prev => (prev ? [...prev, pos] : null));
        }
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        if (currentStroke && currentStroke.length > 1) {
            onStrokeComplete({
                points: currentStroke!,
                color: activeColor,
                width: tool === 'highlighter' ? 30 : 4,
                opacity: tool === 'highlighter' ? 0.4 : 1,
                itemId: currentStrokeItemId
            });
        }
        setCurrentStroke(null);
        setCurrentStrokeItemId(undefined);
        (e.target as Element).releasePointerCapture(e.pointerId);
    };

    return (
        <>
            <canvas ref={canvasRef} className="absolute inset-0 z-[2000] pointer-events-none" />
            <canvas
                ref={activeCanvasRef}
                className={`absolute inset-0 z-[2010] touch-none ${(tool === 'laser' || tool === 'dictionary') ? 'pointer-events-none' : 'cursor-crosshair'}`}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
            />
        </>
    );
};
