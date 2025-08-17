'use client';
import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Delete",
  cancelText = "Cancel",
  type = "danger" // "danger" or "warning"
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const confirmButtonClass = type === "danger" 
    ? "bg-red-600 hover:bg-red-700 text-white"
    : "bg-orange-600 hover:bg-orange-700 text-white";

  return (
    <div 
      className="fixed inset-0  flex items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 animate-in fade-in duration-200">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
              type === "danger" ? "bg-red-100" : "bg-orange-100"
            }`}>
              <AlertTriangle 
                size={20} 
                className={type === "danger" ? "text-red-600" : "text-orange-600"} 
              />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-gray-900">
                {title}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="ml-auto text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="mb-6">
            <p className="text-sm text-gray-500">
              {message}
            </p>
          </div>
          
          <div className="flex space-x-3 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors ${confirmButtonClass}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};