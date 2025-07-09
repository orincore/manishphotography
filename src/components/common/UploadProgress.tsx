import React, { useState, useEffect } from 'react';
import { UploadProgress as UploadProgressType } from '../../services/socketService';
import socketService from '../../services/socketService';

interface UploadProgressProps {
  uploadId: string;
  onComplete?: (element: any) => void;
  onError?: (error: string) => void;
  onCancel?: () => void;
  className?: string;
}

const UploadProgress: React.FC<UploadProgressProps> = ({
  uploadId,
  onComplete,
  onError,
  onCancel,
  className = ''
}) => {
  const [progress, setProgress] = useState<UploadProgressType | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!uploadId) return;

    setIsVisible(true);
    
    // Set initial progress state for immediate feedback
    setProgress({
      uploadId,
      status: 'starting',
      progress: 0,
      message: 'Initializing upload...'
    });
    
    // Connect to socket if not already connected
    if (!socketService.isConnected()) {
      socketService.connect();
    }

    // Join the upload room
    socketService.joinUpload(uploadId);

    // Listen for progress updates
    const handleProgress = (progressData: UploadProgressType) => {
      if (progressData.uploadId === uploadId) {
        setProgress(progressData);
        
        // Handle completion
        if (progressData.status === 'completed' && progressData.element) {
          onComplete?.(progressData.element);
          setTimeout(() => setIsVisible(false), 2000); // Hide after 2 seconds
        }
        
        // Handle error
        if (progressData.status === 'error') {
          onError?.(progressData.message);
          setTimeout(() => setIsVisible(false), 3000); // Hide after 3 seconds
        }
      }
    };

    socketService.onUploadProgress(handleProgress);

    // Cleanup
    return () => {
      socketService.offUploadProgress(handleProgress);
      socketService.leaveUpload(uploadId);
    };
  }, [uploadId, onComplete, onError]);

  if (!isVisible || !progress) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'starting':
        return 'text-blue-600';
      case 'compressing':
        return 'text-yellow-600';
      case 'uploading':
        return 'text-green-600';
      case 'completed':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'starting':
        return (
          <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        );
      case 'compressing':
        return (
          <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        );
      case 'uploading':
        return (
          <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        );
      case 'completed':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      default:
        return null;
    }
  };

  // Enhanced message display for video uploads
  const getDisplayMessage = (progress: UploadProgressType) => {
    if (progress.uploadId.startsWith('temp_')) {
      // For temporary upload IDs, show more informative messages
      switch (progress.status) {
        case 'starting':
          return 'Preparing video for upload and compression...';
        case 'compressing':
          return progress.message || 'Compressing video (this may take 10-20 minutes for very large files)...';
        case 'uploading':
          return progress.message || 'Uploading compressed video...';
        default:
          return progress.message;
      }
    }
    return progress.message;
  };

  // Add a helpful note for very long compressions
  const shouldShowLongCompressionNote = progress.status === 'compressing' && 
    progress.progress > 0 && progress.progress < 50 && 
    progress.uploadId.startsWith('temp_');

  const getProgressBarColor = (status: string) => {
    switch (status) {
      case 'starting':
        return 'bg-blue-600';
      case 'compressing':
        return 'bg-yellow-600';
      case 'uploading':
        return 'bg-green-600';
      case 'completed':
        return 'bg-green-600';
      case 'error':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  };

  return (
    <div className={`fixed top-4 right-4 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 ${className}`}>
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            {getStatusIcon(progress.status)}
            <span className={`font-medium ${getStatusColor(progress.status)}`}>
              {progress.status.charAt(0).toUpperCase() + progress.status.slice(1)}
            </span>
          </div>
          {onCancel && progress.status !== 'completed' && progress.status !== 'error' && (
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
          <div
            className={`h-2 rounded-full transition-all duration-300 ease-out ${getProgressBarColor(progress.status)}`}
            style={{ width: `${progress.progress}%` }}
          />
        </div>

        {/* Progress Text */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">{getDisplayMessage(progress)}</span>
          <span className="font-medium text-gray-900">{Math.round(progress.progress)}%</span>
        </div>

        {/* Long compression note */}
        {shouldShowLongCompressionNote && (
          <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
            💡 <strong>Note:</strong> Large video compression can take 10-20 minutes. 
            The upload will continue in the background even if this window closes.
          </div>
        )}

        {/* Upload ID (for debugging) */}
        <div className="mt-2 text-xs text-gray-400 font-mono">
          ID: {uploadId}
        </div>
      </div>
    </div>
  );
};

export default UploadProgress; 