'use client';
import { AddApplicationModal } from '@/components/AddApplicationModel';
import { FilterPanel } from '@/components/FilterPanel';
import { KanbanColumn } from '@/components/KanbanColumn';
import { useApplications } from '@/hooks/useApplication';
import { useAuth } from '@/hooks/useAuth';
import { BarChart3, Columns, LogOut, User, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useMemo, useState, useEffect } from 'react';

// DND Kit imports
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

const COLUMNS = [
  { id: 'applied', title: 'Applied' },
  { id: 'interview', title: 'Interview' },
  { id: 'offer', title: 'Offer' },
  { id: 'rejected', title: 'Rejected' }
];

const page = () => {

  const { user, loading: authLoading, signOut } = useAuth();
  const router = useRouter();
  const { applications, loading, error, addApplication, updateApplication, deleteApplication } = useApplications();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('kanban');
  const [activeId, setActiveId] = useState(null);
  const [filters, setFilters] = useState({
    role: '',
    status: '',
    minExperience: 0,
    maxExperience: 50,
    search: ''
  });

  // Configure sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Filter applications
  const filteredApplications = useMemo(() => {
    return applications.filter(app => {
      const matchesRole = !filters.role || app.role === filters.role;
      const matchesStatus = !filters.status || app.status === filters.status;
      const matchesExperience = 
        app.experience_years >= filters.minExperience && 
        app.experience_years <= filters.maxExperience;
      const matchesSearch = !filters.search || 
        app.candidate_name.toLowerCase().includes(filters.search.toLowerCase()) ||
        app.role.toLowerCase().includes(filters.search.toLowerCase());

      return matchesRole && matchesStatus && matchesExperience && matchesSearch;
    });
  }, [applications, filters]);

  // Get unique roles for filter dropdown
  const uniqueRoles = useMemo(() => 
    Array.from(new Set(applications.map(app => app.role))).sort(),
    [applications]
  );

  // Group applications by status
  const applicationsByStatus = useMemo(() => 
    COLUMNS.reduce((acc, column) => {
      acc[column.id] = filteredApplications.filter(app => app.status === column.id);
      return acc;
    }, {}),
    [filteredApplications]
  );

  // Get the application being dragged for the overlay
  const activeApplication = useMemo(() => {
    return applications.find(app => app.id === activeId);
  }, [activeId, applications]);

  // Handle redirect in useEffect instead of during render
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
  }, [user, authLoading, router]);
  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if user is not authenticated (redirect is happening)
  if (!user) {
    return null;
  }

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Check if we're dropping over a column
    const isOverColumn = COLUMNS.some(col => col.id === overId);
    
    if (isOverColumn) {
      const newStatus = overId;
      const application = applications.find(app => app.id === activeId);
      
      if (application && application.status !== newStatus) {
        try {
          await updateApplication(activeId, { status: newStatus });
        } catch (error) {
          console.error('Failed to update application status:', error);
        }
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
<div className="bg-white shadow-sm border-b border-gray-200">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center py-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">ATS Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome back, {user.email}
        </p>
      </div>

      <div className="flex items-center space-x-4">
        {/* View Mode Toggle */}
        <div className="flex rounded-lg bg-gray-100 p-1">
          <button
            onClick={() => setViewMode('kanban')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
              viewMode === 'kanban' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Columns size={16} />
            <span>Kanban</span>
          </button>
          <button
            onClick={() => setViewMode('analytics')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
              viewMode === 'analytics' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <BarChart3 size={16} />
            <span>Analytics</span>
          </button>
        </div>

        {/* Add Application Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 shadow-sm"
        >
          <Plus size={16} />
          <span>Add Application</span>
        </button>

        {/* Visual Separator */}
        <div className="h-6 w-px bg-gray-300"></div>

        {/* Logout Button - At the end */}
        <button
          onClick={handleSignOut}
          className="text-gray-500 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50"
          title="Sign Out"
        >
          <LogOut size={20} />
        </button>
      </div>
    </div>
  </div>
</div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {viewMode === 'kanban' ? (
          <>
            <FilterPanel 
              filters={filters} 
              onFiltersChange={setFilters}
              roles={uniqueRoles}
            />

            <DndContext
              sensors={sensors}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {COLUMNS.map(column => (
                  <KanbanColumn
                    key={column.id}
                    title={column.title}
                    status={column.id}
                    applications={applicationsByStatus[column.id] || []}
                    onDelete={deleteApplication}
                  />
                ))}
              </div>

              <DragOverlay>
                {activeApplication ? (
                  <div className="bg-white rounded-lg shadow-2xl p-4 border border-gray-200 rotate-2 scale-105 opacity-95">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-gray-900 text-lg leading-tight">
                        {activeApplication.candidate_name}
                      </h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-600">
                        <User size={14} className="mr-2 text-blue-500" />
                        <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                          {activeApplication.role}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>

            {filteredApplications.length === 0 && applications.length > 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No applications match your current filters.</p>
                <button
                  onClick={() => setFilters({
                    role: '',
                    status: '',
                    minExperience: 0,
                    maxExperience: 50,
                    search: ''
                  })}
                  className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {applications.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg mb-4">No applications yet.</p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Your First Application
                </button>
              </div>
            )}
          </>
        ) : (
          <div>
            hello
          </div>
        )}
      </div>

      <AddApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addApplication}
      />
    </div>
  )
}

export default page