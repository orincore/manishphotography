import React, { useState } from 'react';
import { useUploadProgress } from '../../hooks/useUploadProgress';
import UploadProgress from '../common/UploadProgress';
import homepageService from '../../services/homepageService';
import { showSuccessNotification, showErrorNotification, showInfoNotification } from '../../utils/notifications';

const ProgressTrackingDemo: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [currentUploadId, setCurrentUploadId] = useState<string | null>(null);
  
  const { progress, isUploading, isCompleted, isError, error, startTracking, stopTracking, reset } = useUploadProgress();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      showErrorNotification('Please select a file first');
      return;
    }

    try {
      setUploading(true);
      reset(); // Reset any previous upload progress
      
      const formData = new FormData();
      formData.append('type', 'hero-video');
      formData.append('title', 'Demo Video Upload');
      formData.append('subtitle', 'Testing progress tracking');
      formData.append('description', 'This is a demo video upload to test real-time progress tracking');
      formData.append('media_file', selectedFile);
      formData.append('is_active', 'true');
      formData.append('is_featured', 'false');
      formData.append('video_autoplay', 'true');
      formData.append('video_muted', 'true');
      formData.append('video_loop', 'true');

      const result = await homepageService.createElement(formData);
      
      // Start tracking progress if uploadId is returned
      if (result.uploadId) {
        setCurrentUploadId(result.uploadId);
        startTracking(result.uploadId);
        showSuccessNotification('Upload started! Watch the progress in real-time.');
      } else {
        // No progress tracking, handle as regular upload
        showSuccessNotification('Element created successfully (no progress tracking)');
        setUploading(false);
      }
    } catch (error) {
      console.error('Error creating element:', error);
      showErrorNotification('Failed to create element');
      setUploading(false);
    }
  };

  const handleUploadComplete = (element: any) => {
    showSuccessNotification('Upload completed successfully!');
    setUploading(false);
    setCurrentUploadId(null);
    setSelectedFile(null);
  };

  const handleUploadError = (errorMessage: string) => {
    showErrorNotification(`Upload failed: ${errorMessage}`);
    setUploading(false);
    setCurrentUploadId(null);
  };

  const handleUploadCancel = () => {
    stopTracking();
    setUploading(false);
    setCurrentUploadId(null);
    showInfoNotification('Upload cancelled');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Progress Tracking */}
      {currentUploadId && (
        <UploadProgress
          uploadId={currentUploadId}
          onComplete={handleUploadComplete}
          onError={handleUploadError}
          onCancel={handleUploadCancel}
        />
      )}
      
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Real-time Progress Tracking Demo
          </h1>
          
          <div className="space-y-6">
            {/* Description */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-blue-900 mb-2">How it works</h2>
              <p className="text-blue-800">
                This demo showcases real-time progress tracking for video uploads using Socket.IO. 
                When you upload a video file, you'll see live updates for:
              </p>
              <ul className="list-disc list-inside mt-2 text-blue-800 space-y-1">
                <li><strong>Starting:</strong> Initial upload preparation</li>
                <li><strong>Compressing:</strong> Video compression with progress percentage</li>
                <li><strong>Uploading:</strong> Upload to Cloudinary with progress</li>
                <li><strong>Completed:</strong> Success confirmation with element data</li>
                <li><strong>Error:</strong> Real-time error reporting</li>
              </ul>
            </div>

            {/* File Selection */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <div className="text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="mt-4">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-gray-900">
                      {selectedFile ? selectedFile.name : 'Select a video file'}
                    </span>
                    <span className="mt-1 block text-xs text-gray-500">
                      MP4, MOV, AVI up to 500MB
                    </span>
                  </label>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    accept="video/*"
                    onChange={handleFileSelect}
                    disabled={uploading}
                  />
                </div>
              </div>
            </div>

            {/* File Info */}
            {selectedFile && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Selected File:</h3>
                <div className="text-sm text-gray-600">
                  <p><strong>Name:</strong> {selectedFile.name}</p>
                  <p><strong>Size:</strong> {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                  <p><strong>Type:</strong> {selectedFile.type}</p>
                </div>
              </div>
            )}

            {/* Upload Button */}
            <div className="flex justify-center">
              <button
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {uploading ? 'Uploading...' : 'Start Upload with Progress Tracking'}
              </button>
            </div>

            {/* Progress Info */}
            {progress && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-medium text-green-900 mb-2">Current Progress:</h3>
                <div className="text-sm text-green-800">
                  <p><strong>Status:</strong> {progress.status}</p>
                  <p><strong>Progress:</strong> {Math.round(progress.progress)}%</p>
                  <p><strong>Message:</strong> {progress.message}</p>
                  <p><strong>Upload ID:</strong> <code className="bg-green-100 px-1 rounded">{progress.uploadId}</code></p>
                </div>
              </div>
            )}

            {/* Connection Status */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Connection Status:</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Socket.IO:</strong> {isUploading ? 'Connected' : 'Disconnected'}</p>
                <p><strong>Upload State:</strong> {isUploading ? 'Active' : isCompleted ? 'Completed' : isError ? 'Error' : 'Idle'}</p>
                {error && <p><strong>Error:</strong> {error}</p>}
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-medium text-yellow-900 mb-2">Instructions:</h3>
              <ol className="list-decimal list-inside text-sm text-yellow-800 space-y-1">
                <li>Select a video file (preferably large for better testing)</li>
                <li>Click "Start Upload with Progress Tracking"</li>
                <li>Watch the progress indicator in the top-right corner</li>
                <li>Observe real-time updates for compression and upload</li>
                <li>You can cancel the upload at any time</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTrackingDemo; 