'use client';
import React from 'react';
import { Search, Filter, X } from 'lucide-react';

export const FilterPanel = ({
  filters,
  onFiltersChange,
  roles = ['Frontend Developer', 'Backend Developer', 'Full Stack', 'Manager', 'Designer']
}) => {
  const hasActiveFilters = filters.search || filters.role || filters.status || filters.experience;

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      role: '',
      status: '',
      experience: ''
    });
  };

  const experienceOptions = [
    { value: '', label: 'Experience' },
    { value: '0-1', label: '0-1 years' },
    { value: '1-3', label: '1-3 years' },
    { value: '3-5', label: '3-5 years' },
    { value: '5-10', label: '5-10 years' },
    { value: '10+', label: '10+ years' }
  ];

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/60 shadow-sm mb-6">
      {/* Compact Single Row Layout */}
      <div className="p-4">
        <div className="flex items-center gap-4 flex-wrap">
          {/* Filter Icon & Title */}
          <div className="flex items-center space-x-2 shrink-0">
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-sm">
              <Filter className="text-white" size={14} />
            </div>
            <span className="text-sm font-semibold text-gray-700">Filters</span>
          </div>

          <div className="h-4 w-px bg-gray-200 shrink-0"></div>

          {/* Search - Compact */}
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
                placeholder="Search candidates by name or role"
                className="w-full pl-9 pr-8 py-2 text-sm text-gray-900 placeholder-gray-400 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-200"
              />
              {filters.search && (
                <button
                  onClick={() => onFiltersChange({ ...filters, search: '' })}
                  className="absolute inset-y-0 right-0 pr-2 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Role - Compact */}
          <div className="min-w-[140px]">
            <div className="relative">
              <select
                value={filters.role}
                onChange={(e) => onFiltersChange({ ...filters, role: e.target.value })}
                className="w-full pl-3 pr-8 py-2 text-sm text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-200 appearance-none cursor-pointer"
              >
                <option value="">All Roles</option>
                {roles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg className="h-3 w-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Status - Compact */}
          <div className="min-w-[140px]">
            <div className="relative">
              <select
                value={filters.status}
                onChange={(e) => onFiltersChange({ ...filters, status: e.target.value })}
                className="w-full pl-3 pr-8 py-2 text-sm text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-200 appearance-none cursor-pointer"
              >
                <option value="">All Status</option>
                <option value="applied">Applied</option>
                <option value="interview">Interview</option>
                <option value="offer">Offer</option>
                <option value="rejected">Rejected</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg className="h-3 w-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Experience - Dropdown */}
          <div className="min-w-[140px]">
            <div className="relative">
              <select
                value={filters.experience || ''}
                onChange={(e) => onFiltersChange({ ...filters, experience: e.target.value })}
                className="w-full pl-3 pr-8 py-2 text-sm text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-200 appearance-none cursor-pointer"
              >
                {experienceOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg className="h-3 w-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <>
              <div className="h-4 w-px bg-gray-200 shrink-0"></div>
              <button
                onClick={clearFilters}
                className="flex items-center space-x-1 px-2 py-1.5 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors duration-200 shrink-0"
              >
                <X size={12} />
                <span>Clear</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};