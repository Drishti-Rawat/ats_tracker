import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { ApplicationCard } from './ApplicationCard';

const statusColors = {
  applied: 'bg-blue-50 border-blue-200',
  interview: 'bg-yellow-50 border-yellow-200',
  offer: 'bg-green-50 border-green-200',
  rejected: 'bg-red-50 border-red-200'
};

const statusBadgeColors = {
  applied: 'bg-blue-500',
  interview: 'bg-yellow-500',
  offer: 'bg-green-500',
  rejected: 'bg-red-500'
};

export const KanbanColumn = ({
  title,
  status,
  applications,
  onDelete
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  const applicationIds = applications.map(app => app.id);

  return (
    <div className={`flex flex-col rounded-lg border-2 ${statusColors[status]} min-h-[600px]`}>
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-800 text-lg">{title}</h2>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${statusBadgeColors[status]}`}></div>
            <span className="text-sm font-medium text-gray-600 bg-white px-2 py-1 rounded">
              {applications.length}
            </span>
          </div>
        </div>
      </div>

      <SortableContext items={applicationIds} strategy={verticalListSortingStrategy}>
        <div
          ref={setNodeRef}
          className={`flex-1 p-4 transition-colors duration-200 ${
            isOver ? 'bg-gray-50' : ''
          }`}
        >
          {applications.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              onDelete={onDelete}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
};