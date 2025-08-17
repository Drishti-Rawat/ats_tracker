"use client";
import { AuthModal } from '@/components/AuthModel';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from 'lucide-react';
import React from 'react';

const Page = () => {
  const { user, loading: authLoading } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
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
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <div className="mb-6">
            <User className="mx-auto h-16 w-16 text-blue-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to ATS Dashboard</h2>
            <p className="text-gray-600">
              Please sign in to access your job application tracker and analytics dashboard.
            </p>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Sign In / Sign Up
          </button>
        </div>
        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={() => setIsAuthModalOpen(false)} 
        />
      </div>
    );
  }

  // while redirecting, we can show a blank or loader
  return null;
};

export default Page;
