'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { User, Calendar, Link as LinkIcon, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

export const ApplicationCard = ({
  application,
  onDelete
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: application.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this application?')) {
      onDelete(application.id);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white rounded-lg shadow-md p-4 mb-3 border border-gray-200 transition-all duration-200 hover:shadow-lg cursor-grab active:cursor-grabbing ${
        isDragging ? 'rotate-2 shadow-2xl scale-105 z-50' : ''
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-gray-900 text-lg leading-tight">
          {application.candidate_name}
        </h3>
        <button
          onClick={handleDelete}
          className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded hover:bg-red-50 cursor-pointer"
          style={{ cursor: 'pointer' }}
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center text-gray-600">
          <User size={14} className="mr-2 text-blue-500" />
          <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
            {application.role}
          </span>
        </div>

        <div className="flex items-center text-gray-600">
          <Calendar size={14} className="mr-2 text-green-500" />
          <span className="text-sm">
            {application.experience_years} years experience
          </span>
        </div>

        {application.resume_link && (
          <div className="flex items-center">
            <LinkIcon size={14} className="mr-2 text-purple-500" />
            <a
              href={application.resume_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-purple-600 hover:text-purple-800 underline cursor-pointer"
              onClick={(e) => e.stopPropagation()}
              style={{ cursor: 'pointer' }}
            >
              View Resume
            </a>
          </div>
        )}

        <div className="text-xs text-gray-500 mt-3 pt-2 border-t border-gray-100">
          Added {format(new Date(application.created_at), 'MMM d, yyyy')}
        </div>
      </div>
    </div>
  );
};