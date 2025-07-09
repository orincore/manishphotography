import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Star, 
  StarOff, 
  Move, 
  Plus,
  Image as ImageIcon,
  Video,
  Settings
} from 'lucide-react';
import Button from '../common/Button';
import homepageService, { HomepageElement, HomepageStats } from '../../services/homepageService';

const HomepageManager = () => {
  const [elements, setElements] = useState<HomepageElement[]>([]);
  const [stats, setStats] = useState<HomepageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingElement, setEditingElement] = useState<HomepageElement | null>(null);

  useEffect(() => {
    fetchElements();
    fetchStats();
  }, [selectedType]);

  const fetchElements = async () => {
    try {
      setLoading(true);
      const params = selectedType !== 'all' ? { type: selectedType } : {};
      const response = await homepageService.getAllElements(params);
      setElements(response.elements);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load homepage elements');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const statsData = await homepageService.getHomepageStats();
      setStats(statsData);
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  const handleUpload = async (formData: FormData) => {
    try {
      await homepageService.createElement(formData);
      setShowUploadModal(false);
      fetchElements();
      fetchStats();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to upload element');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this element?')) return;
    
    try {
      await homepageService.deleteElement(id);
      fetchElements();
      fetchStats();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete element');
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      await homepageService.toggleActiveStatus(id, !isActive);
      fetchElements();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update element status');
    }
  };

  const handleToggleFeatured = async (id: string, isFeatured: boolean) => {
    try {
      await homepageService.updateElement(id, { is_featured: !isFeatured });
      fetchElements();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update element status');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'hero_image':
      case 'featured_image':
      case 'instagram_image':
      case 'about_image':
      case 'background_image':
        return <ImageIcon size={16} />;
      case 'hero_video':
        return <Video size={16} />;
      default:
        return <Settings size={16} />;
    }
  };

  const getTypeLabel = (type: string) => {
    return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Homepage Manager</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage hero images, videos, and other homepage content</p>
        </div>
        <Button onClick={() => setShowUploadModal(true)} icon={<Plus size={16} />}>
          Add Element
        </Button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalElements}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Elements</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-green-600">{stats.activeElements}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Active</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-blue-600">{stats.heroImages}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Hero Images</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-purple-600">{stats.heroVideos}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Hero Videos</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-orange-600">{stats.featuredImages}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Featured</div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="all">All Types</option>
          <option value="hero_image">Hero Images</option>
          <option value="hero_video">Hero Videos</option>
          <option value="featured_image">Featured Images</option>
          <option value="instagram_image">Instagram Images</option>
          <option value="about_image">About Images</option>
          <option value="background_image">Background Images</option>
        </select>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Elements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {elements.map((element) => (
          <motion.div
            key={element.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
          >
            {/* Media Preview */}
            <div className="aspect-video relative overflow-hidden">
              {element.image_url ? (
                <img
                  src={element.image_url}
                  alt={element.title || 'Homepage element'}
                  className="w-full h-full object-cover"
                />
              ) : element.video_url ? (
                <video
                  src={element.video_url}
                  className="w-full h-full object-cover"
                  muted
                />
              ) : (
                <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <ImageIcon size={48} className="text-gray-400" />
                </div>
              )}
              
              {/* Status Badges */}
              <div className="absolute top-2 right-2 flex space-x-1">
                {element.is_active ? (
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">Active</span>
                ) : (
                  <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded">Inactive</span>
                )}
                {element.is_featured && (
                  <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded">Featured</span>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {getTypeIcon(element.type)}
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {getTypeLabel(element.type)}
                  </span>
                </div>
                <span className="text-xs text-gray-500">#{element.order}</span>
              </div>

              {element.title && (
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{element.title}</h3>
              )}
              
              {element.subtitle && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{element.subtitle}</p>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between mt-4">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingElement(element)}
                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
                    title="Edit"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleToggleActive(element.id, element.is_active)}
                    className={`p-2 rounded-md transition-colors ${
                      element.is_active
                        ? 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
                        : 'text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                    title={element.is_active ? 'Deactivate' : 'Activate'}
                  >
                    {element.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                  <button
                    onClick={() => handleToggleFeatured(element.id, element.is_featured)}
                    className={`p-2 rounded-md transition-colors ${
                      element.is_featured
                        ? 'text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
                        : 'text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                    title={element.is_featured ? 'Unfeature' : 'Feature'}
                  >
                    {element.is_featured ? <Star size={16} /> : <StarOff size={16} />}
                  </button>
                </div>
                
                <button
                  onClick={() => handleDelete(element.id)}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {elements.length === 0 && !loading && (
        <div className="text-center py-12">
          <ImageIcon size={48} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No elements found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {selectedType === 'all' 
              ? 'No homepage elements have been created yet.'
              : `No ${getTypeLabel(selectedType).toLowerCase()} found.`
            }
          </p>
          <Button onClick={() => setShowUploadModal(true)} icon={<Plus size={16} />}>
            Add Your First Element
          </Button>
        </div>
      )}

      {/* Upload Modal would go here */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Upload Homepage Element</h2>
            {/* Upload form would go here */}
            <div className="flex space-x-2">
              <Button onClick={() => setShowUploadModal(false)} variant="outline">
                Cancel
              </Button>
              <Button onClick={() => setShowUploadModal(false)}>
                Upload
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomepageManager; 