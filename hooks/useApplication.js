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

   const uploadResumeFile = async (file, candidateName) => {
    if (!user || !file) return null;

    try {
      // Create a unique filename
      const timestamp = Date.now();
      const sanitizedCandidateName = candidateName.replace(/[^a-zA-Z0-9]/g, '_');
      const fileName = `${user.id}/${timestamp}_${sanitizedCandidateName}_resume.pdf`;

      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('resumes')
        .getPublicUrl(fileName);

      return {
        filePath: uploadData.path,
        publicUrl: publicUrl,
        fileName: file.name,
        fileSize: file.size
      };
    } catch (error) {
      console.error('Error uploading resume:', error);
      throw new Error('Failed to upload resume file');
    }
  };

   const addApplication = async (application) => {
    if (!user) throw new Error('User must be authenticated');

    try {
      let resumeData = {};

      // Handle file upload if present
      if (application.resumeFile) {
        const uploadResult = await uploadResumeFile(
          application.resumeFile, 
          application.candidate_name
        );
        
        resumeData = {
          resume_url: uploadResult.publicUrl,
          resume_file_path: uploadResult.filePath,
          resume_file_name: uploadResult.fileName,
          resume_file_size: uploadResult.fileSize
        };
      } else if (application.resume_link) {
        resumeData = {
          resume_url: application.resume_link,
          resume_file_name: application.resume_file_name || ''
        };
      }

      // Prepare application data (exclude resumeFile from database insert)
      const { resumeFile, ...applicationData } = application;
      const finalApplicationData = {
        ...applicationData,
        resume_link: resumeData.resume_url || null,
        user_id: user.id
      };

      const { data, error } = await supabase
        .from('applications')
        .insert(finalApplicationData)
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