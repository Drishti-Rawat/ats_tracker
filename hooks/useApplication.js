import { useState, useEffect } from 'react';


import { useAuth } from './useAuth';
import { supabase } from '@/lib/supabaseClient';

export const useApplications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchApplications = async () => {
    if (!user) {
      setApplications([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (err) {
      setError(err ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const addApplication = async (application) => {
    if (!user) throw new Error('User must be authenticated');

    try {
      const { data, error } = await supabase
        .from('applications')
        .insert({ ...application, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      setApplications(prev => [data, ...prev]);
      return data;
    } catch (err) {
      throw new Error(err ? err.message : 'Failed to add application');
    }
  };

  const updateApplication = async (id, updates) => {
    if (!user) throw new Error('User must be authenticated');

    try {
      const { data, error } = await supabase
        .from('applications')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      setApplications(prev => prev.map(app => app.id === id ? data : app));
      return data;
    } catch (err) {
      throw new Error(err  ? err.message : 'Failed to update application');
    }
  };

  const deleteApplication = async (id) => {
    if (!user) throw new Error('User must be authenticated');

    try {
      const { error } = await supabase
        .from('applications')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      setApplications(prev => prev.filter(app => app.id !== id));
    } catch (err) {
      throw new Error(err  ? err.message : 'Failed to delete application');
    }
  };

  useEffect(() => {
    if (user) {
      fetchApplications();
    } else {
      setApplications([]);
      setLoading(false);
    }
  }, [user]);

  return {
    applications,
    loading,
    error,
    addApplication,
    updateApplication,
    deleteApplication,
    refetch: fetchApplications
  };
};