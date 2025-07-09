import { useState, useEffect, useCallback, useRef } from 'react';
import { UploadProgress } from '../services/socketService';
import socketService from '../services/socketService';

interface UseUploadProgressReturn {
  progress: UploadProgress | null;
  isUploading: boolean;
  isCompleted: boolean;
  isError: boolean;
  error: string | null;
  startTracking: (uploadId: string) => void;
  stopTracking: () => void;
  reset: () => void;
}

export const useUploadProgress = (): UseUploadProgressReturn => {
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const [currentUploadId, setCurrentUploadId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const compressionIntervalRef = useRef<number | null>(null);

  const isUploading = progress?.status === 'starting' || 
                     progress?.status === 'compressing' || 
                     progress?.status === 'uploading';

  const isCompleted = progress?.status === 'completed';
  const isError = progress?.status === 'error';

  const handleProgress = useCallback((progressData: UploadProgress) => {
    if (progressData.uploadId === currentUploadId) {
      setProgress(progressData);
      
      if (progressData.status === 'error') {
        setError(progressData.message);
      } else {
        setError(null);
      }
    }
  }, [currentUploadId]);

  const startTracking = useCallback((uploadId: string) => {
    if (!uploadId) {
      console.warn('No upload ID provided, skipping progress tracking');
      return;
    }

    setCurrentUploadId(uploadId);
    setProgress(null);
    setError(null);

    // Clear any existing interval
    if (compressionIntervalRef.current) {
      clearInterval(compressionIntervalRef.current);
      compressionIntervalRef.current = null;
    }

    // Connect to socket if not already connected
    if (!socketService.isConnected()) {
      socketService.connect();
    }

    // Join the upload room
    socketService.joinUpload(uploadId);

    // Listen for progress updates
    socketService.onUploadProgress(handleProgress);

    // For temporary upload IDs, set initial progress and simulate compression
    if (uploadId.startsWith('temp_')) {
      setProgress({
        uploadId,
        status: 'starting',
        progress: 0,
        message: 'Preparing video upload...'
      });

      // Simulate compression progress for temporary uploads
      let simulatedProgress = 0;
      compressionIntervalRef.current = setInterval(() => {
        if (currentUploadId === uploadId && simulatedProgress < 90) {
          // Very slow progress for very long compression times
          simulatedProgress += Math.random() * 1 + 0.2; // 0.2-1.2% increment
          setProgress(prev => prev ? {
            ...prev,
            status: 'compressing',
            progress: Math.min(simulatedProgress, 90),
            message: `Compressing video: ${Math.round(simulatedProgress)}% (this may take 10-20 minutes for very large files)`
          } : null);
        } else {
          if (compressionIntervalRef.current) {
            clearInterval(compressionIntervalRef.current);
            compressionIntervalRef.current = null;
          }
        }
      }, 5000); // Update every 5 seconds for very long compression
    }
  }, [handleProgress, currentUploadId]);

  const stopTracking = useCallback(() => {
    if (currentUploadId) {
      socketService.leaveUpload(currentUploadId);
      socketService.offUploadProgress(handleProgress);
    }
    
    // Clear compression interval
    if (compressionIntervalRef.current) {
      clearInterval(compressionIntervalRef.current);
      compressionIntervalRef.current = null;
    }
    
    setCurrentUploadId(null);
  }, [currentUploadId, handleProgress]);

  const reset = useCallback(() => {
    stopTracking();
    setProgress(null);
    setError(null);
  }, [stopTracking]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTracking();
    };
  }, [stopTracking]);

  return {
    progress,
    isUploading,
    isCompleted,
    isError,
    error,
    startTracking,
    stopTracking,
    reset
  };
}; 