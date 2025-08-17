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
import { Analytics } from '@/components/Analytics';

const COLUMNS = [
  { id: 'applied', title: 'Applied' },
  { id: 'interview', title: 'Interview' },
  { id: 'offer', title: 'Offer' },
  { id: 'rejected', title: 'Rejected' }
];

const DashboardPage = () => {

  const { user, loading: authLoading, signOut } = useAuth();
  console.log("Current user in page component:", user);
  const router = useRouter();
  const { applications, loading, error, addApplication, updateApplication, deleteApplication } = useApplications();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('kanban');
  const [activeId, setActiveId] = useState(null);
  const [filters, setFilters] = useState({
    role: '',
    status: '',
    experience: '', 
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

  // Helper function to check if experience matches the selected range
  const matchesExperience = (experienceYears, experienceFilter) => {
    if (!experienceFilter) return true; // No filter selected
    
    switch (experienceFilter) {
      case '0-1':
        return experienceYears >= 0 && experienceYears <= 1;
      case '1-3':
        return experienceYears >= 1 && experienceYears <= 3;
      case '3-5':
        return experienceYears >= 3 && experienceYears <= 5;
      case '5-10':
        return experienceYears >= 5 && experienceYears <= 10;
      case '10+':
        return experienceYears >= 10;
      default:
        return true;
    }
  };

  // Filter applications
  const filteredApplications = useMemo(() => {
    return applications.filter(app => {
      const matchesRole = !filters.role || app.role === filters.role;
      const matchesStatus = !filters.status || app.status === filters.status;
      const matchesExperienceRange = matchesExperience(app.experience_years, filters.experience);
      const matchesSearch = !filters.search || 
        app.candidate_name.toLowerCase().includes(filters.search.toLowerCase()) ||
        app.role.toLowerCase().includes(filters.search.toLowerCase());

      return matchesRole && matchesStatus && matchesExperienceRange && matchesSearch;
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
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 sm:py-6 space-y-4 sm:space-y-0">
      <div className="flex-1 min-w-0">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 truncate">ATS Dashboard</h1>
        <p className="text-gray-600 mt-1 text-xs sm:text-sm md:text-base truncate">
          Welcome back, {user.email}
        </p>
      </div>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
        {/* View Mode Toggle */}
        <div className="flex rounded-lg bg-gray-100 p-1 w-full sm:w-auto">
          <button
            onClick={() => setViewMode('kanban')}
            className={`flex items-center justify-center space-x-1 sm:space-x-2 px-2 sm:px-3 md:px-4 py-2 rounded-md transition-all flex-1 sm:flex-none ${
              viewMode === 'kanban' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Columns size={14} className="sm:w-4 sm:h-4" />
            <span className="text-xs sm:text-sm md:text-base">Kanban</span>
          </button>
          <button
            onClick={() => setViewMode('analytics')}
            className={`flex items-center justify-center space-x-1 sm:space-x-2 px-2 sm:px-3 md:px-4 py-2 rounded-md transition-all flex-1 sm:flex-none ${
              viewMode === 'analytics' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <BarChart3 size={14} className="sm:w-4 sm:h-4" />
            <span className="text-xs sm:text-sm md:text-base">Analytics</span>
          </button>
        </div>
        {/* Action Buttons Row */}
        <div className="flex items-center justify-between sm:justify-start space-x-3 sm:space-x-4">
          {/* Add Application Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-2 sm:px-3 md:px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1 sm:space-x-2 shadow-sm flex-1 sm:flex-none justify-center sm:justify-start"
          >
            <Plus size={14} className="sm:w-4 sm:h-4" />
            <span className="text-xs sm:text-sm md:text-base">Add Application</span>
          </button>
          {/* Visual Separator - Hidden on mobile and small tablets */}
          <div className="hidden md:block h-6 w-px bg-gray-300"></div>
          {/* Logout Button */}
          <button
            onClick={handleSignOut}
            className="text-gray-500 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50 flex items-center justify-center"
            title="Sign Out"
          >
            <LogOut size={18} className="sm:w-5 sm:h-5" />
            <span className="sr-only">Sign Out</span>
          </button>
        </div>
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
                    experience: '', // Updated clear filters
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
         <Analytics applications={applications} />
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

export default DashboardPage