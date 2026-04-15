import { create } from 'zustand';
import { User } from '../types';
import {
  signIn as supaSignIn,
  signUp as supaSignUp,
  signOut as supaSignOut,
  getSession,
  isSupabaseConfigured,
} from '../services/supabase';
import { Session } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  isDemo: boolean;

  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  restoreSession: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,
  isDemo: false,

  signIn: async (email, password) => {
    set({ isLoading: true, error: null });

    if (!isSupabaseConfigured()) {
      set({
        user: { id: 'demo', email, name: email.split('@')[0] },
        isAuthenticated: true,
        isLoading: false,
        isDemo: true,
      });
      return;
    }

    try {
      const data = await supaSignIn(email, password);
      if (!data.user) {
        // Supabase returned but no user — fall to demo
        set({
          user: { id: 'demo', email, name: email.split('@')[0] },
          isAuthenticated: true,
          isLoading: false,
          isDemo: true,
        });
        return;
      }
      set({
        user: {
          id: data.user.id,
          email: data.user.email || email,
          name: data.user.user_metadata?.name || email.split('@')[0],
        },
        session: data.session,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      set({ error: error.message || 'Sign in failed', isLoading: false });
      throw error;
    }
  },

  signUp: async (email, password) => {
    set({ isLoading: true, error: null });

    if (!isSupabaseConfigured()) {
      set({
        user: { id: 'demo', email, name: email.split('@')[0] },
        isAuthenticated: true,
        isLoading: false,
        isDemo: true,
      });
      return;
    }

    try {
      const data = await supaSignUp(email, password);
      if (!data.user) {
        set({
          user: { id: 'demo', email, name: email.split('@')[0] },
          isAuthenticated: true,
          isLoading: false,
          isDemo: true,
        });
        return;
      }
      set({
        user: {
          id: data.user.id,
          email: data.user.email || email,
          name: data.user.user_metadata?.name || email.split('@')[0],
        },
        session: data.session,
        isAuthenticated: !!data.session,
        isLoading: false,
      });
    } catch (error: any) {
      set({ error: error.message || 'Sign up failed', isLoading: false });
      throw error;
    }
  },

  signOut: async () => {
    try {
      await supaSignOut();
    } catch {
      // silent
    }
    set({
      user: null,
      session: null,
      isAuthenticated: false,
      isLoading: false,
      isDemo: false,
    });
  },

  restoreSession: async () => {
    set({ isLoading: true });
    try {
      const session = await getSession();
      if (session?.user) {
        set({
          user: {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || '',
          },
          session,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
