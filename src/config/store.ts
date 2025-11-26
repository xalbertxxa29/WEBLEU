import { create } from 'zustand';
import { User } from 'firebase/auth';

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

interface NotificationStore {
  notifications: Notification[];
  addNotification: (message: string, type: Notification['type'], duration?: number) => void;
  removeNotification: (id: string) => void;
}

interface AuthStore {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  addNotification: (message, type, duration = 3000) => {
    const id = Date.now().toString();
    set((state) => ({
      notifications: [...state.notifications, { id, message, type }],
    }));
    
    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id),
      }));
    }, duration);
  },
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
}));

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
}));
