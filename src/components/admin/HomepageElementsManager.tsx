import React, { useState, useEffect } from 'react';
import homepageService, { HomepageElement, CreateHomepageElementData } from '../../services/homepageService';
import { showSuccessNotification, showErrorNotification, showInfoNotification } from '../../utils/notifications';
import { useUploadProgress } from '../../hooks/useUploadProgress';
import UploadProgress from '../common/UploadProgress';
import { AnimatePresence, motion } from 'framer-motion';

interface HomepageElementsManagerProps {
  onClose?: () => void;
}

const HomepageElementsManager: React.FC<HomepageElementsManagerProps> = ({ onClose }) => {
  const [elements, setElements] = useState<HomepageElement[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('hero');
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [editingElement, setEditingElement] = useState<HomepageElement | null>(null);
  const [currentUploadId, setCurrentUploadId] = useState<string | null>(null);
  const [backgroundChecking, setBackgroundChecking] = useState(false);
  
  // Progress tracking
  const { progress, isUploading, isCompleted, isError, error, startTracking, stopTracking, reset } = useUploadProgress();

  // Upload form state
  const [uploadData, setUploadData] = useState({
    type: 'hero',
    title: '',
    subtitle: '',
    description: '',
    mediaFile: null as File | null,
    isActive: true,
    isFeatured: false,
    videoAutoplay: true,
    videoMuted: true,
    videoLoop: true,
  });

  const elementTypes = [
    { value: 'hero', label: 'Hero Image', requiresMedia: true },
    { value: 'hero-video', label: 'Hero Video', requiresMedia: true },
  ];

  useEffect(() => {
    fetchElements();
  }, [selectedType]);

  const fetchElements = async () => {
    try {
      setLoading(true);
      const response = await homepageService.getAllElements({ type: selectedType });
      setElements(response.elements);
    } catch (error) {
      console.error('Error fetching elements:', error);
      showErrorNotification('Failed to fetch elements');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadData(prev => ({ ...prev, mediaFile: file }));
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uploadData.title.trim()) {
      showErrorNotification('Title is required');
      return;
    }

    const selectedTypeConfig = elementTypes.find(t => t.value === uploadData.type);
    if (selectedTypeConfig?.requiresMedia && !uploadData.mediaFile) {
      showErrorNotification('Media file is required for this type');
      return;
    }

    try {
      setUploading(true);
      
      // Check if this is a video upload that needs progress tracking
      const isVideoUpload = uploadData.type.includes('video') && uploadData.mediaFile;
      const isLargeVideo = uploadData.mediaFile && uploadData.mediaFile.size > 10 * 1024 * 1024; // 10MB
      
      if (isVideoUpload && isLargeVideo) {
        reset(); // Reset any previous upload progress only for large videos
        await handleVideoUpload();
      } else {
        // For images and small videos, don't reset progress tracking
        await handleRegularUpload();
      }
    } catch (error) {
      console.error('Error creating element:', error);
      showErrorNotification('Failed to create element');
      setUploading(false);
    }
  };

  const handleVideoUpload = async () => {
    try {
      // Generate a temporary upload ID for progress tracking
      const tempUploadId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setCurrentUploadId(tempUploadId);
      startTracking(tempUploadId);

      // Close the popup immediately and show notification
      setShowUploadForm(false);
      resetUploadForm();
      setUploading(false);
      
      // Show initial "Starting" notification
      showInfoNotification('Starting video upload...');

      // Show "Upload successful" after 1 minute
      setTimeout(() => {
        showSuccessNotification('Upload successful! Your video will be visible shortly.');
      }, 60000); // 1 minute

      const formData = new FormData();
      formData.append('type', uploadData.type);
      formData.append('title', uploadData.title);
      if (uploadData.subtitle) formData.append('subtitle', uploadData.subtitle);
      if (uploadData.description) formData.append('description', uploadData.description);
      if (uploadData.mediaFile) formData.append('media_file', uploadData.mediaFile);
      formData.append('is_active', uploadData.isActive.toString());
      formData.append('is_featured', uploadData.isFeatured.toString());
      formData.append('video_autoplay', uploadData.videoAutoplay.toString());
      formData.append('video_muted', uploadData.videoMuted.toString());
      formData.append('video_loop', uploadData.videoLoop.toString());

      // Add timeout to the API call - much longer for video compression
      const apiPromise = homepageService.createElement(formData);
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), 1800000); // 30 minutes timeout for video compression
      });

      const result = await Promise.race([apiPromise, timeoutPromise]) as any;
      
      // If we get a real uploadId from the backend, switch to it
      if (result.uploadId && result.uploadId !== tempUploadId) {
        stopTracking(); // Stop tracking the temp ID
        setCurrentUploadId(result.uploadId);
        startTracking(result.uploadId);
      } else if (result.element) {
        // If no uploadId but we got the element, it means it completed immediately
        handleUploadComplete(result.element);
      } else {
        // No uploadId and no element - this might be an error
        throw new Error('Upload completed but no element data received');
      }
    } catch (error) {
      console.error('Error in video upload:', error);
      
      // Handle different types of errors
      if (error instanceof Error) {
        if (error.message.includes('timeout') || error.message.includes('Request timeout')) {
          // For timeouts, show a more helpful message and suggest checking the admin panel
          showInfoNotification('Video compression is taking longer than expected. The upload may still be processing in the background. Please check the homepage elements list in a few minutes, or try uploading a smaller video file.');
          setCurrentUploadId(null);
          
          // More robust background checking - check multiple times
          const checkUploadStatus = async (attempt: number = 1) => {
            try {
              setBackgroundChecking(true);
              const previousCount = elements.length;
              await fetchElements();
              const newCount = elements.length;
              
              if (newCount > previousCount) {
                showSuccessNotification('Video upload completed successfully in the background!');
                setBackgroundChecking(false);
                return true;
              } else {
                if (attempt < 10) { // Try up to 10 times (5 minutes total)
                  setTimeout(() => checkUploadStatus(attempt + 1), 30000); // Check every 30 seconds
                } else {
                  showInfoNotification('Upload may still be processing. Please refresh the page in a few minutes to see if it completed.');
                  setBackgroundChecking(false);
                }
                return false;
              }
            } catch (err) {
              if (attempt < 10) { // Try up to 10 times
                setTimeout(() => checkUploadStatus(attempt + 1), 30000);
              } else {
                showInfoNotification('Unable to check upload status. Please refresh the page in a few minutes.');
                setBackgroundChecking(false);
              }
              return false;
            }
          };
          
          // Start checking after 1 minute
          setTimeout(() => checkUploadStatus(), 60000);
          
          return;
        } else if (error.message.includes('413') || error.message.includes('Payload too large')) {
          handleUploadError('Video file is too large. Please use a smaller file or compress it before uploading.');
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          handleUploadError('Network error. Please check your connection and try again.');
        } else {
          handleUploadError(`Upload failed: ${error.message}`);
        }
      } else {
        handleUploadError('Video upload failed. Please try again.');
      }
    }
  };

  const handleRegularUpload = async () => {
    const formData = new FormData();
    formData.append('type', uploadData.type);
    formData.append('title', uploadData.title);
    if (uploadData.subtitle) formData.append('subtitle', uploadData.subtitle);
    if (uploadData.description) formData.append('description', uploadData.description);
    if (uploadData.mediaFile) formData.append('media_file', uploadData.mediaFile);
    formData.append('is_active', uploadData.isActive.toString());
    formData.append('is_featured', uploadData.isFeatured.toString());
    
    if (uploadData.type.includes('video')) {
      formData.append('video_autoplay', uploadData.videoAutoplay.toString());
      formData.append('video_muted', uploadData.videoMuted.toString());
      formData.append('video_loop', uploadData.videoLoop.toString());
    }

    const result = await homepageService.createElement(formData);
    
    // For regular uploads (images, small videos), don't use progress tracking
    showSuccessNotification('Element created successfully');
    setShowUploadForm(false);
    resetUploadForm();
    fetchElements();
    setUploading(false);
  };

  const handleEdit = async (element: HomepageElement) => {
    try {
      const updatedData: any = {
        title: element.title,
        subtitle: element.subtitle,
        description: element.description,
        is_active: element.is_active,
        is_featured: element.is_featured,
      };

      if (element.type.includes('video')) {
        updatedData.video_autoplay = element.video_autoplay;
        updatedData.video_muted = element.video_muted;
        updatedData.video_loop = element.video_loop;
      }

      await homepageService.updateElement(element.id, updatedData);
      showSuccessNotification('Element updated successfully');
      setEditingElement(null);
      fetchElements();
    } catch (error) {
      console.error('Error updating element:', error);
      showErrorNotification('Failed to update element');
    }
  };

  const handleDelete = async (elementId: string) => {
    if (!confirm('Are you sure you want to delete this element?')) return;

    try {
      await homepageService.deleteElement(elementId);
      showSuccessNotification('Element deleted successfully');
      fetchElements();
    } catch (error) {
      console.error('Error deleting element:', error);
      showErrorNotification('Failed to delete element');
    }
  };

  const handleToggleActive = async (element: HomepageElement) => {
    try {
      await homepageService.toggleActiveStatus(element.id, !element.is_active);
      showSuccessNotification(`Element ${element.is_active ? 'deactivated' : 'activated'} successfully`);
      fetchElements();
    } catch (error) {
      console.error('Error toggling element status:', error);
      showErrorNotification('Failed to update element status');
    }
  };

  const resetUploadForm = () => {
    setUploadData({
      type: 'hero',
      title: '',
      subtitle: '',
      description: '',
      mediaFile: null,
      isActive: true,
      isFeatured: false,
      videoAutoplay: true,
      videoMuted: true,
      videoLoop: true,
    });
  };

  // Handle upload completion
  const handleUploadComplete = (element: any) => {
    // Only show completion notification if it's been more than 1 minute
    // (to avoid duplicate messages with the 1-minute timer)
    const timeSinceUpload = Date.now() - parseInt(currentUploadId?.split('_')[1] || '0');
    if (timeSinceUpload > 60000) {
      showSuccessNotification('Video upload completed successfully!');
    }
    fetchElements();
    setUploading(false);
    setCurrentUploadId(null);
  };

  // Handle upload error
  const handleUploadError = (errorMessage: string) => {
    showErrorNotification(`Upload failed: ${errorMessage}`);
    setUploading(false);
    setCurrentUploadId(null);
  };

  // Handle upload cancellation
  const handleUploadCancel = () => {
    stopTracking();
    setUploading(false);
    setCurrentUploadId(null);
    showInfoNotification('Upload cancelled');
  };

  const getMediaPreview = (element: HomepageElement) => {
    const mediaUrl = element.media_url || element.image_url;
    if (!mediaUrl) return null;

    if (element.media_type === 'video' || element.type.includes('video')) {
      return (
        <video 
          src={element.video_url || mediaUrl} 
          className="w-full h-32 object-cover rounded"
          muted
          loop
        />
      );
    }

    return (
      <img 
        src={mediaUrl} 
        alt={element.title || 'Element'} 
        className="w-full h-32 object-cover rounded"
      />
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-2 sm:p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-xl">Loading elements...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4 md:p-6 lg:p-8">
      {/* Progress Tracking - Only show for video uploads */}
      {currentUploadId && currentUploadId.startsWith('temp_') && (
        <UploadProgress
          uploadId={currentUploadId}
          onComplete={handleUploadComplete}
          onError={handleUploadError}
          onCancel={handleUploadCancel}
        />
      )}
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 md:mb-8 gap-4 md:gap-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Homepage Elements Manager</h1>
            <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">Manage all homepage content including hero images, testimonials, and more</p>
            {backgroundChecking && (
              <div className="mt-2 flex items-center space-x-2 text-blue-600">
                <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="text-xs sm:text-sm">Checking for completed uploads in background...</span>
              </div>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full md:w-auto">
            <button
              onClick={() => setShowUploadForm(true)}
              className="bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
            >
              Add New Element
            </button>
            <button
              onClick={fetchElements}
              className="bg-green-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 w-full sm:w-auto"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh</span>
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="bg-gray-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors w-full sm:w-auto"
              >
                Close
              </button>
            )}
          </div>
        </div>

        {/* Type Filter */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6 sm:mb-8 overflow-x-auto">
          <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Filter by Type</h2>
          <motion.div 
            className="flex flex-wrap gap-2 sm:gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {elementTypes.map((type, index) => (
              <motion.button
                key={type.value}
                onClick={() => setSelectedType(type.value)}
                className={`p-2 sm:p-3 rounded-lg border-2 transition-all duration-300 text-xs sm:text-sm min-w-[120px] sm:min-w-[140px] ${
                  selectedType === type.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ 
                  duration: 0.4, 
                  delay: index * 0.1,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                whileHover={{ 
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ 
                  scale: 0.98,
                  transition: { duration: 0.1 }
                }}
              >
                <div className="font-medium">{type.label}</div>
                <div className="text-[10px] sm:text-xs text-gray-500">
                  {type.requiresMedia ? 'Media Required' : 'Text Only'}
                </div>
              </motion.button>
            ))}
          </motion.div>
        </div>

        {/* Elements Grid */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={selectedType}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ 
              duration: 0.5, 
              ease: [0.25, 0.46, 0.45, 0.94],
              staggerChildren: 0.1
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          >
            {elements.map((element, index) => (
              <motion.div 
                key={element.id} 
                className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col"
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.4, 
                  delay: index * 0.1,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                whileHover={{ 
                  y: -5,
                  transition: { duration: 0.2 }
                }}
              >
                {/* Media Preview */}
                {getMediaPreview(element)}
                
                {/* Content */}
                <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 sm:mb-4 gap-2 sm:gap-0">
                    <div>
                      <h3 className="font-semibold text-base sm:text-lg">{element.title}</h3>
                      {element.subtitle && (
                        <p className="text-gray-600 text-xs sm:text-sm">{element.subtitle}</p>
                      )}
                    </div>
                    <div className="flex space-x-2 mt-2 sm:mt-0">
                      <button
                        onClick={() => setEditingElement(element)}
                        className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm transition-colors duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(element.id)}
                        className="text-red-600 hover:text-red-800 text-xs sm:text-sm transition-colors duration-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {element.description && (
                    <p className="text-gray-700 text-xs sm:text-sm mb-3 sm:mb-4">{element.description}</p>
                  )}

                  {/* Status Indicators */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm gap-2 sm:gap-0">
                    <div className="flex space-x-2">
                      <span className={`px-2 py-1 rounded transition-colors duration-200 ${
                        element.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {element.is_active ? 'Active' : 'Inactive'}
                      </span>
                      {element.is_featured && (
                        <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-800 transition-colors duration-200">
                          Featured
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleToggleActive(element)}
                      className={`px-3 py-1 rounded text-xs sm:text-sm transition-all duration-200 ${
                        element.is_active
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {element.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {elements.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">No elements found for this type</div>
            <button
              onClick={() => setShowUploadForm(true)}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Add First Element
            </button>
          </div>
        )}

        {/* Upload Modal */}
        {showUploadForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Add New Element</h2>
                <button
                  onClick={() => {
                    setShowUploadForm(false);
                    resetUploadForm();
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleUpload} className="space-y-6">
                {/* Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Element Type *
                  </label>
                  <select
                    value={uploadData.type}
                    onChange={(e) => setUploadData(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    {elementTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={uploadData.title}
                    onChange={(e) => setUploadData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Subtitle */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={uploadData.subtitle}
                    onChange={(e) => setUploadData(prev => ({ ...prev, subtitle: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={uploadData.description}
                    onChange={(e) => setUploadData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Media Upload */}
                {elementTypes.find(t => t.value === uploadData.type)?.requiresMedia && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Media File *
                    </label>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept={uploadData.type.includes('video') ? 'video/*' : 'image/*'}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {uploadData.type.includes('video') 
                        ? 'Supported formats: MP4, MOV, AVI (max 500MB)' 
                        : 'Supported formats: JPG, PNG, GIF (max 10MB)'
                      }
                    </p>
                  </div>
                )}

                {/* Video Settings */}
                {uploadData.type.includes('video') && (
                  <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-700">Video Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={uploadData.videoAutoplay}
                          onChange={(e) => setUploadData(prev => ({ ...prev, videoAutoplay: e.target.checked }))}
                          className="mr-2"
                        />
                        Autoplay
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={uploadData.videoMuted}
                          onChange={(e) => setUploadData(prev => ({ ...prev, videoMuted: e.target.checked }))}
                          className="mr-2"
                        />
                        Muted
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={uploadData.videoLoop}
                          onChange={(e) => setUploadData(prev => ({ ...prev, videoLoop: e.target.checked }))}
                          className="mr-2"
                        />
                        Loop
                      </label>
                    </div>
                  </div>
                )}

                {/* Status Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={uploadData.isActive}
                      onChange={(e) => setUploadData(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="mr-2"
                    />
                    Active
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={uploadData.isFeatured}
                      onChange={(e) => setUploadData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                      className="mr-2"
                    />
                    Featured
                  </label>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowUploadForm(false);
                      resetUploadForm();
                    }}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {uploading ? 'Creating...' : 'Create Element'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editingElement && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Edit Element</h2>
                <button
                  onClick={() => setEditingElement(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={editingElement.title || ''}
                    onChange={(e) => setEditingElement(prev => prev ? { ...prev, title: e.target.value } : null)}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                  <input
                    type="text"
                    value={editingElement.subtitle || ''}
                    onChange={(e) => setEditingElement(prev => prev ? { ...prev, subtitle: e.target.value } : null)}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={editingElement.description || ''}
                    onChange={(e) => setEditingElement(prev => prev ? { ...prev, description: e.target.value } : null)}
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setEditingElement(null)}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => editingElement && handleEdit(editingElement)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomepageElementsManager; 