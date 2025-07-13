import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Upload, 
  Video, 
  Image, 
  Settings,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { 
  PortfolioProject, 
  PortfolioVideo, 
  PortfolioImage,
  VideoUploadSettings 
} from '../../types';
import portfolioService from '../../services/portfolioService';
import { useUploadProgress } from '../../hooks/useUploadProgress';

interface PortfolioProjectManagerProps {
  onProjectUpdate?: () => void;
}

const PortfolioProjectManager: React.FC<PortfolioProjectManagerProps> = ({ 
  onProjectUpdate 
}) => {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showVideoUpload, setShowVideoUpload] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    tags: [] as string[],
    isPublished: true,
    subcategoryId: ''
  });
  
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoSettings, setVideoSettings] = useState<VideoUploadSettings>({
    video_autoplay: false,
    video_muted: false, // Allow audio by default
    video_loop: false,
    order_index: 0
  });

  // Upload progress tracking
  const { progress, isUploading, startUpload, cancelUpload } = useUploadProgress();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await portfolioService.getAllProjects();
      setProjects(response.projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Project title is required');
      return;
    }

    if (imageFiles.length === 0) {
      toast.error('At least one image is required');
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('tags', JSON.stringify(formData.tags));
      formDataToSend.append('isPublished', formData.isPublished.toString());
      
      if (formData.subcategoryId) {
        formDataToSend.append('subcategoryId', formData.subcategoryId);
      }

      imageFiles.forEach(file => {
        formDataToSend.append('images', file);
      });

      await portfolioService.createProject(formDataToSend);
      
      toast.success('Project created successfully');
      setShowCreateForm(false);
      resetForm();
      fetchProjects();
      onProjectUpdate?.();
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('Failed to create project');
    }
  };

  const handleVideoUpload = async () => {
    if (!selectedProject || !videoFile) {
      toast.error('Please select a project and video file');
      return;
    }

    try {
      // Check if it's a large video file for progress tracking
      const isLargeVideo = videoFile.size > 10 * 1024 * 1024; // 10MB
      
      if (isLargeVideo) {
        startUpload();
      }

      await portfolioService.uploadProjectVideo(
        selectedProject.id,
        videoFile,
        videoSettings
      );

      if (isLargeVideo) {
        // Show completion notification
        setTimeout(() => {
          toast.success('Video upload completed successfully');
        }, 1000);
      } else {
        toast.success('Video uploaded successfully');
      }

      setShowVideoUpload(false);
      setVideoFile(null);
      resetVideoSettings();
      fetchProjects();
      onProjectUpdate?.();
    } catch (error) {
      console.error('Error uploading video:', error);
      toast.error('Failed to upload video');
    } finally {
      if (isLargeVideo) {
        cancelUpload();
      }
    }
  };

  const handleTogglePublish = async (project: PortfolioProject) => {
    try {
      await portfolioService.togglePublishStatus(project.id, !project.is_published);
      toast.success(`Project ${project.is_published ? 'unpublished' : 'published'} successfully`);
      fetchProjects();
      onProjectUpdate?.();
    } catch (error) {
      console.error('Error toggling publish status:', error);
      toast.error('Failed to update publish status');
    }
  };

  const handleDeleteProject = async (project: PortfolioProject) => {
    if (!confirm(`Are you sure you want to delete "${project.title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await portfolioService.deleteProject(project.id);
      toast.success('Project deleted successfully');
      fetchProjects();
      onProjectUpdate?.();
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
    }
  };

  const handleDeleteVideo = async (videoId: string) => {
    if (!confirm('Are you sure you want to delete this video?')) {
      return;
    }

    try {
      await portfolioService.deleteVideo(videoId);
      toast.success('Video deleted successfully');
      fetchProjects();
      onProjectUpdate?.();
    } catch (error) {
      console.error('Error deleting video:', error);
      toast.error('Failed to delete video');
    }
  };

  const handleDeleteImage = async (projectId: string, imageId: string) => {
    if (!confirm('Are you sure you want to delete this image?')) {
      return;
    }

    try {
      await portfolioService.deleteProjectImage(projectId, imageId);
      toast.success('Image deleted successfully');
      fetchProjects();
      onProjectUpdate?.();
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Failed to delete image');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      tags: [],
      isPublished: true,
      subcategoryId: ''
    });
    setImageFiles([]);
  };

  const resetVideoSettings = () => {
    setVideoSettings({
      video_autoplay: false,
      video_muted: false,
      video_loop: false,
      order_index: 0
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="portfolio-project-manager">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Portfolio Projects
        </h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={20} />
          Create Project
        </button>
      </div>

      {/* Projects List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
          >
            {/* Project Image */}
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={project.thumbnail_url || project.image_url}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Project Info */}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {project.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                {project.description}
              </p>

              {/* Project Stats */}
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-3">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Image size={14} />
                    {portfolioService.getImageCount(project)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Video size={14} />
                    {portfolioService.getVideoCount(project)}
                  </span>
                </div>
                <span>{project.view_count} views</span>
              </div>

              {/* Status Badge */}
              <div className="flex items-center justify-between mb-3">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  project.is_published 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                }`}>
                  {project.is_published ? 'Published' : 'Draft'}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedProject(project)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-lg text-sm transition-colors"
                >
                  <Settings size={16} className="inline mr-1" />
                  Manage
                </button>
                
                <button
                  onClick={() => handleTogglePublish(project)}
                  className="p-2 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300 rounded-lg transition-colors"
                >
                  {project.is_published ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                
                <button
                  onClick={() => handleDeleteProject(project)}
                  className="p-2 bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 text-red-700 dark:text-red-300 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Create Project Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-xl font-semibold mb-4">Create New Project</h3>
            
            <form onSubmit={handleCreateProject}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.tags.join(', ')}
                    onChange={(e) => setFormData({...formData, tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="wedding, outdoor, portrait"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Images *</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => setImageFiles(Array.from(e.target.files || []))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  />
                  {imageFiles.length > 0 && (
                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      Selected {imageFiles.length} image(s)
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isPublished"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({...formData, isPublished: e.target.checked})}
                    className="rounded"
                  />
                  <label htmlFor="isPublished" className="text-sm">Publish immediately</label>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Create Project
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Video Upload Modal */}
      {showVideoUpload && selectedProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-xl font-semibold mb-4">
              Upload Video to "{selectedProject.title}"
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Video File *</label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                />
                {videoFile && (
                  <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {videoFile.name} ({formatFileSize(videoFile.size)})
                  </div>
                )}
              </div>

              {/* Video Settings */}
              <div className="space-y-3">
                <h4 className="font-medium">Video Settings</h4>
                
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="video_autoplay"
                    checked={videoSettings.video_autoplay}
                    onChange={(e) => setVideoSettings({...videoSettings, video_autoplay: e.target.checked})}
                    className="rounded"
                  />
                  <label htmlFor="video_autoplay" className="text-sm">Autoplay</label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="video_muted"
                    checked={videoSettings.video_muted}
                    onChange={(e) => setVideoSettings({...videoSettings, video_muted: e.target.checked})}
                    className="rounded"
                  />
                  <label htmlFor="video_muted" className="text-sm">Muted (No Audio)</label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="video_loop"
                    checked={videoSettings.video_loop}
                    onChange={(e) => setVideoSettings({...videoSettings, video_loop: e.target.checked})}
                    className="rounded"
                  />
                  <label htmlFor="video_loop" className="text-sm">Loop</label>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Display Order</label>
                  <input
                    type="number"
                    min="0"
                    value={videoSettings.order_index}
                    onChange={(e) => setVideoSettings({...videoSettings, order_index: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              {/* Upload Progress */}
              {isUploading && (
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span>Uploading video...</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowVideoUpload(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleVideoUpload}
                disabled={!videoFile || isUploading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
              >
                {isUploading ? 'Uploading...' : 'Upload Video'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Project Management Modal */}
      {selectedProject && !showVideoUpload && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-xl font-semibold mb-4">
              Manage "{selectedProject.title}"
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Images Section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">Images ({portfolioService.getImageCount(selectedProject)})</h4>
                </div>
                
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {selectedProject.images?.map((image) => (
                    <div key={image.id} className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <img
                        src={image.thumbnail_url}
                        alt="Project image"
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1 text-sm">
                        <div className="font-medium">Image</div>
                        <div className="text-gray-500 dark:text-gray-400">ID: {image.id}</div>
                      </div>
                      <button
                        onClick={() => handleDeleteImage(selectedProject.id, image.id)}
                        className="p-1 text-red-600 hover:text-red-800 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Videos Section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">Videos ({portfolioService.getVideoCount(selectedProject)})</h4>
                  <button
                    onClick={() => setShowVideoUpload(true)}
                    className="flex items-center gap-1 text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition-colors"
                  >
                    <Upload size={14} />
                    Add Video
                  </button>
                </div>
                
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {selectedProject.videos?.map((video) => (
                    <div key={video.id} className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <video
                        src={video.video_url}
                        poster={video.video_thumbnail_url}
                        className="w-12 h-12 object-cover rounded"
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        controls={false}
                        onMouseOver={e => e.currentTarget.play()}
                        onMouseOut={e => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
                      />
                      <div className="flex-1 text-sm">
                        <div className="font-medium">Video</div>
                        <div className="text-gray-500 dark:text-gray-400">
                          Duration: {video.video_duration}s | 
                          Audio: {video.video_muted ? 'Muted' : 'Enabled'}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteVideo(video.id)}
                        className="p-1 text-red-600 hover:text-red-800 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setSelectedProject(null)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default PortfolioProjectManager; 