import React, { useState, useEffect } from 'react';
import { notificationService } from '../../lib/notifications';
import { NotificationsMenu } from './NotificationsMenu';
import { Bell } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Props {
  userId?: string;
}

export const NotificationsBell: React.FC<Props> = ({ userId: initialUserId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [userId, setUserId] = useState<string | null>(initialUserId || null);

  useEffect(() => {
    if (!userId) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user?.id) {
          setUserId(session.user.id);
        }
      });
    }
  }, [initialUserId]);

  useEffect(() => {
    if (userId) {
      updateCount();
      // Polling or Realtime could be added here
      const interval = setInterval(updateCount, 60000); // Check every minute
      return () => clearInterval(interval);
    }
  }, [userId]);

  const updateCount = async () => {
    if (!userId) return;
    const count = await notificationService.getUnreadCount(userId);
    setUnreadCount(count);
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Re-fetch when opening
      updateCount();
    }
  };

  return (
    <div className="relative inline-block">
      <button 
        onClick={handleToggle}
        className="notifications-btn"
        aria-label="Notificações"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="notifications-badge">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <NotificationsMenu 
        userId={userId} 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
      />

      <style jsx>{`
        .notifications-btn {
          position: relative;
          background: none;
          border: none;
          color: var(--color-slate-mid);
          cursor: pointer;
          padding: 0.6rem;
          border-radius: 50%;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .notifications-btn:hover {
          background-color: var(--color-ice);
          color: var(--color-action);
        }
        .notifications-badge {
          position: absolute;
          top: 4px;
          right: 4px;
          min-width: 16px;
          height: 16px;
          padding: 0 4px;
          background-color: #ff4d4d;
          border: 2px solid white;
          border-radius: 8px;
          font-size: 0.65rem;
          font-weight: 800;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </div>
  );
};
