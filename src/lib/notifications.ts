import { supabase } from './supabase';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'assignment' | 'completion' | 'system';
  read: boolean;
  link?: string;
  created_at: string;
}

export const notificationService = {
  async getUnreadCount(userId: string): Promise<number> {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('read', false);
    
    if (error) {
      console.error('Error fetching notification count:', error);
      return 0;
    }
    return count || 0;
  },

  async listNotifications(userId: string, limit = 10): Promise<AppNotification[]> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error listing notifications:', error);
      return [];
    }
    return data as AppNotification[];
  },

  async markAsRead(notificationId: string) {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);
    
    if (error) console.error('Error marking as read:', error);
  },

  async markAllAsRead(userId: string) {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false);
    
    if (error) console.error('Error marking all as read:', error);
  },

  async sendNotification(userId: string, title: string, message: string, type: string, link?: string) {
    const { error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        title,
        message,
        type,
        link
      });
    
    if (error) console.error('Error sending notification:', error);
  }
};
