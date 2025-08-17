'use client';
import React, { useState } from 'react';
import { X, Plus, Upload, File, Eye, Trash2 } from 'lucide-react';

export const AddApplicationModal = ({
  isOpen,
  onClose,
  onAdd
}) => {
  const [formData, setFormData] = useState({
    candidate_name: '',
    role: '',
    experience_years: 0,
    resume_link: '',
    status: 'applied' 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Please select a PDF file');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      setResumeFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const removeFile = () => {
    setResumeFile(null);
    setPreviewUrl('');
    setFormData({ ...formData, resume_link: '' });
    setUploadProgress(0);
    const fileInput = document.getElementById('resume-upload');
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.candidate_name.trim() || !formData.role.trim()) return;

    try {
      setIsSubmitting(true);
      
      let finalFormData = { ...formData };
      
      if (resumeFile) {
        finalFormData.resumeFile = resumeFile;
      }
      
      await onAdd(finalFormData);
      
      setFormData({
        candidate_name: '',
        role: '',
        experience_years: 0,
        resume_link: '',
        status: 'applied'
      });
      setResumeFile(null);
      setPreviewUrl('');
      setUploadProgress(0);
      onClose();
    } catch (error) {
      console.error('Failed to add application:', error);
      alert('Failed to add application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md flex flex-col max-h-[85vh]">
        {/* Fixed Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-900">Add New Application</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Candidate Name *
              </label>
              <input
                type="text"
                required
                value={formData.candidate_name}
                onChange={(e) => setFormData({ ...formData, candidate_name: e.target.value })}
                className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="Enter candidate name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role *
              </label>
              <input
                type="text"
                required
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="e.g., Frontend Developer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Years of Experience
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={formData.experience_years}
                onChange={(e) => setFormData({ ...formData, experience_years: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="Years of experience"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Initial Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="applied">Applied</option>
                <option value="interview">Interview</option>
                <option value="offer">Offer</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Resume Upload Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Resume Upload
              </label>
              
              {!resumeFile ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    id="resume-upload"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="resume-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Upload size={20} className="text-gray-400 mb-1" />
                    <span className="text-xs text-gray-600">
                      Upload PDF (Max 5MB)
                    </span>
                  </label>
                </div>
              ) : (
                <div className="border border-gray-300 rounded-lg p-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center min-w-0 flex-1">
                      <File size={14} className="text-red-500 mr-2 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-medium text-gray-700 truncate">
                          {resumeFile.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 ml-2">
                      <button
                        type="button"
                        onClick={() => window.open(previewUrl, '_blank')}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                        title="Preview PDF"
                      >
                        <Eye size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={removeFile}
                        className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                        title="Remove file"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                  
                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-1">
                        <div
                          className="bg-blue-600 h-1 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Fixed Footer */}
        <div className="p-4 border-t border-gray-200 flex-shrink-0">
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm"
            >
              <Plus size={14} />
              <span>{isSubmitting ? 'Adding...' : 'Add Application'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};