import React, { useState, useEffect } from 'react';
import { notificationService, type AppNotification } from '../../lib/notifications';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  userId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsMenu: React.FC<Props> = ({ userId, isOpen, onClose }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && userId) {
      fetchNotifications();
    }
  }, [isOpen, userId]);

  const fetchNotifications = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const data = await notificationService.listNotifications(userId);
      setNotifications(data);
    } catch (err) {
      console.error('Erro ao carregar notificações:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id: string) => {
    await notificationService.markAsRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllRead = async () => {
    await notificationService.markAllAsRead(userId);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  if (!isOpen) return null;

  return (
    <div className="notifications-dropdown-container">
      <div className="notifications-overlay" onClick={onClose} />
      <motion.div 
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        className="notifications-dropdown"
      >
        <div className="dropdown-header">
          <h3 className="dropdown-title">Notificações</h3>
          {notifications.some(n => !n.read) && (
            <button onClick={handleMarkAllRead} className="mark-all-btn">
              Ler tudo
            </button>
          )}
        </div>

        <div className="dropdown-body">
          {loading ? (
            <div className="dropdown-state">Carregando...</div>
          ) : notifications.length === 0 ? (
            <div className="dropdown-state">Nenhuma notificação por enquanto.</div>
          ) : (
            <div className="notifications-list">
              {notifications.map(n => (
                <div 
                  key={n.id} 
                  className={`notification-item ${n.read ? 'read' : 'unread'}`}
                  onClick={() => handleMarkRead(n.id)}
                >
                  <div className="notification-icon">
                    {n.type === 'assignment' ? '🎯' : n.type === 'completion' ? '✅' : '📢'}
                  </div>
                  <div className="notification-content">
                    <p className="notification-title">{n.title}</p>
                    <p className="notification-msg">{n.message}</p>
                    <span className="notification-time">
                      {new Date(n.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  {!n.read && <div className="unread-dot" />}
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      <style jsx>{`
        .notifications-dropdown-container {
          position: absolute;
          top: 100%;
          left: 0;
          z-index: 2000;
        }
        .notifications-overlay {
          position: fixed;
          inset: 0;
          z-index: -1;
        }
        .notifications-dropdown {
          width: 320px;
          background: white;
          border-radius: 1rem;
          box-shadow: 0 20px 50px rgba(0,0,0,0.15);
          border: 1px solid var(--color-slate-border);
          margin-top: 0.5rem;
          overflow: hidden;
        }
        .dropdown-header {
          padding: 1rem;
          border-bottom: 1px solid var(--color-slate-border);
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: var(--color-white);
        }
        .dropdown-title {
          font-family: var(--font-outfit);
          font-weight: 700;
          font-size: 1rem;
          margin: 0;
          color: var(--color-slate-dark);
        }
        .mark-all-btn {
          background: none;
          border: none;
          color: var(--color-action);
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
        }
        .dropdown-body {
          max-height: 400px;
          overflow-y: auto;
        }
        .dropdown-state {
          padding: 3rem 1rem;
          text-align: center;
          color: var(--color-slate-mid);
          font-size: 0.9rem;
        }
        .notification-item {
          padding: 1rem;
          display: flex;
          gap: 1rem;
          cursor: pointer;
          transition: background 0.2s;
          border-bottom: 1px solid var(--color-slate-border);
          position: relative;
        }
        .notification-item:last-child {
          border-bottom: none;
        }
        .notification-item:hover {
          background: var(--color-ice);
        }
        .notification-item.unread {
          background: #f0f7ff;
        }
        .notification-icon {
          font-size: 1.25rem;
          flex-shrink: 0;
        }
        .notification-content {
          flex: 1;
        }
        .notification-title {
          font-weight: 700;
          font-size: 0.875rem;
          margin: 0;
          color: var(--color-slate-dark);
        }
        .notification-msg {
          font-size: 0.8rem;
          color: var(--color-slate-mid);
          margin: 0.2rem 0;
          line-height: 1.4;
        }
        .notification-time {
          font-size: 0.7rem;
          color: var(--color-slate-mid);
          font-weight: 500;
        }
        .unread-dot {
          width: 8px;
          height: 8px;
          background: var(--color-action);
          border-radius: 50%;
          position: absolute;
          top: 1.25rem;
          right: 0.75rem;
        }
      `}</style>
    </div>
  );
};
