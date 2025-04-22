import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface UserWithProfile extends User {
  name?: string;
}

interface AuthContextType {
  user: UserWithProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserWithProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        
        if (currentSession?.user) {
          const userWithProfile: UserWithProfile = {
            ...currentSession.user,
          };
          
          setUser(userWithProfile);
          
          // Fetch additional profile data after short delay to avoid deadlocks
          if (event === 'SIGNED_IN') {
            setTimeout(async () => {
              try {
                // We query our newly created public.users table
                const { data, error } = await supabase
                  .from('users')
                  .select('name')
                  .eq('id', currentSession.user.id)
                  .single();
                  
                if (!error && data) {
                  setUser(prev => prev ? { ...prev, name: data.name } : null);
                }
              } catch (error) {
                console.error('Error fetching user profile:', error);
              }
            }, 0);
            
            toast.success('Successfully logged in!');
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          toast.info('You have been logged out');
        }
      }
    );

    // Then check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        setSession(initialSession);
        
        if (initialSession?.user) {
          const userWithProfile: UserWithProfile = {
            ...initialSession.user,
          };
          
          setUser(userWithProfile);
          
          // Fetch additional profile data from our users table
          const { data, error: profileError } = await supabase
            .from('users')
            .select('name')
            .eq('id', initialSession.user.id)
            .single();
            
          if (!profileError && data) {
            setUser(prev => prev ? { ...prev, name: data.name } : null);
          }
        }
      } catch (error) {
        console.error('Session initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeAuth();

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      // User data is handled by the auth state change listener
    } catch (error: any) {
      toast.error(error.message || 'Authentication failed. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // First, register the user with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      
      if (data.user) {
        // Then, add additional user data to our users table
        const { error: profileError } = await supabase
          .from('users')
          .insert([
            {
              id: data.user.id,
              email: email,
              name: name,
              password_hash: '' // We don't store the actual password, Supabase handles that
            }
          ]);
          
        if (profileError) {
          console.error('Error creating user profile:', profileError);
          throw profileError;
        }
        
        toast.success('Account created successfully!');
      }
    } catch (error: any) {
      toast.error(error.message || 'Registration failed. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      // User state is handled by the auth state change listener
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Error signing out. Please try again.');
    }
  };

  const resetPassword = async (email: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://unieats-express.vercel.app/reset-password',
      });
      
      if (error) throw error;
      toast.success('Password reset email sent! Check your inbox.');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send password reset email. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        register,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
