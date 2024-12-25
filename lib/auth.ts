import { supabase } from './supabase';

export type AuthState = {
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  isLoading: boolean;
};

export async function getAuthState(): Promise<AuthState> {
  const { data: { session } } = await supabase.auth.getSession();
  
  return {
    isAuthenticated: !!session,
    isEmailVerified: !!session?.user.email_confirmed_at,
    isLoading: false,
  };
}