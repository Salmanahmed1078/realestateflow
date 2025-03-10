import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id?: string;
  name: string;
  email: string;
  avatar?: string;
}

interface UserState {
  user: User | null;
  isLoggedIn: boolean;
  isTemporaryLogin: boolean;
  sessionExpiryTime: number | null;
  login: (user: User) => void;
  temporaryLogin: (user: User, expiryMinutes?: number) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  checkSessionExpiry: () => boolean;
}

export const useUserStore = create<UserState>(
  persist(
    (set, get) => ({
      user: null,
      isLoggedIn: false,
      isTemporaryLogin: false,
      sessionExpiryTime: null,
      login: (user: User) => set({ user, isLoggedIn: true, isTemporaryLogin: false, sessionExpiryTime: null }),
      temporaryLogin: (user: User, expiryMinutes = 30) => {
        const expiryTime = Date.now() + expiryMinutes * 60 * 1000;
        set({ 
          user, 
          isLoggedIn: true, 
          isTemporaryLogin: true,
          sessionExpiryTime: expiryTime
        });
        
        // Set up a timer to check session expiry
        const checkInterval = setInterval(() => {
          const hasExpired = get().checkSessionExpiry();
          if (hasExpired) {
            clearInterval(checkInterval);
          }
        }, 60000); // Check every minute
        
        return () => clearInterval(checkInterval);
      },
      logout: () => set({ user: null, isLoggedIn: false, isTemporaryLogin: false, sessionExpiryTime: null }),
      updateUser: (userData: Partial<User>) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),
      checkSessionExpiry: () => {
        const state = get();
        if (state.isTemporaryLogin && state.sessionExpiryTime) {
          if (Date.now() >= state.sessionExpiryTime) {
            set({ user: null, isLoggedIn: false, isTemporaryLogin: false, sessionExpiryTime: null });
            return true;
          }
        }
        return false;
      },
    }),
    {
      name: 'user-storage', // unique name for localStorage
      getStorage: () => localStorage, // use localStorage
    }
  )
);

// Initialize session expiry check on app load
if (typeof window !== 'undefined') {
  // Make sure we're in browser environment
  setTimeout(() => {
    useUserStore.getState().checkSessionExpiry();
  }, 1000);
}