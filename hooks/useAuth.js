import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Navigate to dashboard when user is signed in
        if (event === 'SIGNED_IN' && session?.user) {
          router.push('/dashboard');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [router]);

  const signUp = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (data?.user && !error) {
      if (data.session) {
        return { data, error };
      } else {
        // Email confirmation required - try to sign in after signup
        const signInResult = await signIn(email, password);
        return signInResult;
      }
    }

    return { data, error };
  };

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      router.push('/'); // Redirect to home page after sign out
    }
    return { error };
  };

  return {
    user,
    loading,
    signUp,
    signIn,
    signOut,
  };
};