import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Destrave1Editor } from './Destrave1Editor';
import { Destrave1Player } from './Destrave1Player';
import type { Destrave1Question } from '../../types/destrave1';
import { Toaster, toast } from 'react-hot-toast';

interface Destrave1AppProps {
  initialConfig?: any;
  initialQuestions?: Destrave1Question[];
  editingId?: string;
  assignmentId?: string;
  initialTitle?: string;
}

type AppState = 'LOADING' | 'EDITOR' | 'PLAYER';

export const Destrave1App: React.FC<Destrave1AppProps> = ({
  initialConfig,
  initialQuestions = [],
  editingId,
  assignmentId,
  initialTitle
}) => {
  const [appState, setAppState] = useState<AppState>('LOADING');
  const [userRole, setUserRole] = useState<'teacher'|'student'|null>(null);

  useEffect(() => {
    checkRole();
  }, []);

  const checkRole = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();
      
    const role = (profile?.role as 'teacher' | 'student') || 'student';
    setUserRole(role);

    if (assignmentId) {
       setAppState('PLAYER');
    } else if (role === 'teacher') {
       setAppState('EDITOR');
    } else {
       // Falback caso um aluno acesse sem assignmentId
       window.location.href = '/dashboard';
    }
  };

  if (appState === 'LOADING') {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-brand)]"></div>
      </div>
    );
  }

  return (
    <div className="destrave1-app-container w-full max-w-5xl mx-auto">
      <Toaster position="top-right" />
      {appState === 'EDITOR' && (
        <Destrave1Editor 
          initialQuestions={initialQuestions} 
          editingId={editingId} 
          initialTitle={initialTitle}
        />
      )}
      {appState === 'PLAYER' && assignmentId && (
        <Destrave1Player 
          questions={initialQuestions} 
          assignmentId={assignmentId} 
          activityTitle={initialTitle} 
        />
      )}
    </div>
  );
};
