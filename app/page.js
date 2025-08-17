"use client";
import { AuthModal } from '@/components/AuthModel';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from 'lucide-react';
import React from 'react';

const Page = () => {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  console.log("Current user in Page component:", user);

  useEffect(() => {
    if (user) {
      // Redirect to dashboard when signed in
      router.push("/dashboard");
    }
  }, [user, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
        
          <AuthModal 
            isOpen={true}
            inline={true} // Enable inline mode
          />
        </div>
      </div>
    );
  }

  return null;
};

export default Page;