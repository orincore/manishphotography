import React, { useState, useEffect } from 'react';
import { createPortfolioProject, fetchCategories, fetchSubcategories } from '../../services/portfolioService';
import portfolioService from '../../services/portfolioService';
import adminService from '../../services/adminService';
import { PlusCircle, Image as ImageIcon, Loader2, CheckCircle, AlertCircle, Trash2, Video, Volume2, VolumeX, Play, Pause, RotateCcw, Settings } from 'lucide-react';
import axios from 'axios';
import api from '../../services/api';

const ProjectUploadForm = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '', // use 'category' as string, not categoryId
    subcategoryId: '',
    tags: '',
    isPublished: true, // default to published
    images: [] as File[],
    videos: [] as File[],
  });
  
  // Video settings state
  const [videoSettings, setVideoSettings] = useState({
    video_autoplay: false,
    video_muted: false, // Allow audio by default
    video_loop: false,
    order_index: 0
  });

  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  const [newCategoryOrder, setNewCategoryOrder] = useState(10);
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [categoryError, setCategoryError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  useEffect(() => {
    if (form.category && form.category !== 'create_new') {
      fetchSubcategories(form.category).then(setSubcategories);
    } else {
      setSubcategories([]);
    }
  }, [form.category]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked, files } = e.target as any;
    if (type === 'file') {
      const fileArray = Array.from(files as FileList).slice(0, 10) as File[];
      if (name === 'images') {
        setForm(f => ({ ...f, images: fileArray }));
      } else if (name === 'videos') {
        setForm(f => ({ ...f, videos: fileArray }));
      }
    } else if (type === 'checkbox') {
      setForm(f => ({ ...f, [name]: checked }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
      if (name === 'category' && value === 'create_new') {
        setShowNewCategoryInput(true);
      } else if (name === 'category') {
        setShowNewCategoryInput(false);
        setNewCategoryName('');
      }
    }
  };

  const handleVideoSettingsChange = (setting: string, value: boolean | number) => {
    setVideoSettings(prev => ({ ...prev, [setting]: value }));
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      setCategoryError('Category name is required');
      return;
    }
    setCreatingCategory(true);
    setCategoryError('');
    try {
      const newCat = await adminService.createCategory({
        name: newCategoryName.trim(),
        slug: toSnug(newCategoryName.trim()),
        description: newCategoryDescription,
        display_order: newCategoryOrder,
        is_active: true
      });
      setCategories((prev) => [...prev, newCat.category]);
      setForm(f => ({ ...f, category: newCat.category.id }));
      setShowNewCategoryInput(false);
      setNewCategoryName('');
      setNewCategoryDescription('');
      setNewCategoryOrder(10);
    } catch (err: any) {
      setCategoryError(err?.response?.data?.message || err.message || 'Failed to create category');
    } finally {
      setCreatingCategory(false);
    }
  };

  // Helper to generate slug/snug from category name
  const toSnug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    setUploadProgress(0);
    
    // Validate at least one image or video
    if ((!form.images || form.images.length === 0) && (!form.videos || form.videos.length === 0)) {
      setError('At least one image or video is required.');
      setLoading(false);
      return;
    }
    
    try {
      // Use the mixed media endpoint for projects with images, videos, or both
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      
      // Find the selected category name from the dropdown
      let categoryName = '';
      if (form.category) {
        const selectedCat = categories.find((cat: any) => cat.id === form.category || cat.snug === form.category);
        categoryName = selectedCat ? selectedCat.name : form.category;
      }
      
      // Always send the slug/snug as the category field
      formData.append('category', toSnug(categoryName));
      if (form.subcategoryId) formData.append('subcategoryId', form.subcategoryId);
      if (form.tags) formData.append('tags', JSON.stringify(form.tags.split(',').map((t: string) => t.trim())));
      formData.append('isPublished', String(form.isPublished));
      
      // Add all media files (images and videos) to the same 'media' field
      // Images first
      form.images.forEach(img => {
        formData.append('media', img);
      });
      
      // Videos with their settings
      form.videos.forEach((video, index) => {
        formData.append('media', video);
        // Add video metadata for each video
        formData.append('video_autoplay', videoSettings.video_autoplay.toString());
        formData.append('video_muted', videoSettings.video_muted.toString());
        formData.append('video_loop', videoSettings.video_loop.toString());
        formData.append('order_index', (videoSettings.order_index + index).toString());
      });

      // Create project with mixed media using the correct endpoint
      const projectResponse = await portfolioService.createProjectWithMedia(formData);

      setSuccess('Project created successfully with all media!');
      setForm({ 
        title: '', 
        description: '', 
        category: '', 
        subcategoryId: '', 
        tags: '', 
        isPublished: true, 
        images: [],
        videos: []
      });
      setVideoSettings({
        video_autoplay: false,
        video_muted: false,
        video_loop: false,
        order_index: 0
      });
      setUploadProgress(0);
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  // Remove image handler
  const handleRemoveImage = (idx: number) => {
    setForm(f => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));
  };

  // Remove video handler
  const handleRemoveVideo = (idx: number) => {
    setForm(f => ({ ...f, videos: f.videos.filter((_, i) => i !== idx) }));
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data" className="max-w-6xl w-full mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 md:p-12 mt-6 mb-10">
      <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900 dark:text-white">Upload New Portfolio Project</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-6">Fill in the details below to add a new project to your portfolio with images and videos.</p>
      
      {loading && (
        <div className="w-full mb-4">
          <div className="h-3 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">{uploadProgress}%</div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Basic Info */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div>
            <label className="block font-semibold mb-1">Title</label>
            <input name="title" value={form.title} onChange={handleChange} required className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition" />
          </div>
          
          <div>
            <label className="block font-semibold mb-1">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} required className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 min-h-[100px] bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition" />
          </div>

          <div>
            <label className="block font-semibold mb-1">Tags <span className="text-xs text-gray-400">(comma separated)</span></label>
            <input name="tags" value={form.tags} onChange={handleChange} className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition" />
          </div>

          <div>
            <label className="block font-semibold mb-1">Category</label>
            <select name="category" value={form.category} onChange={handleChange} required className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition">
              <option value="">Select Category</option>
              {categories.map((cat: any) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
              <option value="create_new">+ Create new category</option>
            </select>
            {showNewCategoryInput && (
              <div className="mt-3 p-4 rounded-xl border border-dashed border-blue-400 bg-blue-50 dark:bg-blue-950 flex flex-col gap-3 animate-fade-in">
                <div className="flex items-center gap-2 mb-2">
                  <PlusCircle className="text-blue-600" size={20} />
                  <span className="font-semibold text-blue-700 dark:text-blue-300">Create New Category</span>
                </div>
                <div className="flex flex-col gap-2">
                  <input type="text" value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} placeholder="Category name" className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" required />
                  <input type="text" value={newCategoryDescription} onChange={e => setNewCategoryDescription(e.target.value)} placeholder="Description (optional)" className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                  <input type="number" value={newCategoryOrder} onChange={e => setNewCategoryOrder(Number(e.target.value))} placeholder="Display Order (optional)" className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" min={1} />
                </div>
                <button type="button" onClick={handleCreateCategory} disabled={creatingCategory} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition disabled:opacity-60">
                  {creatingCategory ? <Loader2 className="animate-spin" size={18} /> : <PlusCircle size={18} />} Create
                </button>
                {categoryError && <div className="text-red-600 text-sm flex items-center gap-1"><AlertCircle size={16} />{categoryError}</div>}
              </div>
            )}
          </div>

          {subcategories.length > 0 && (
            <div>
              <label className="block font-semibold mb-1">Subcategory <span className="text-xs text-gray-400">(optional)</span></label>
              <select name="subcategoryId" value={form.subcategoryId} onChange={handleChange} className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition">
                <option value="">Select Subcategory</option>
                {subcategories.map((sub: any) => (
                  <option key={sub.id} value={sub.id}>{sub.name}</option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-center gap-3 mt-2">
            <input type="checkbox" name="isPublished" checked={form.isPublished} onChange={handleChange} id="isPublished" className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
            <label htmlFor="isPublished" className="font-semibold">Published</label>
          </div>
        </div>

        {/* Right Column - Media Upload */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Images Section */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <ImageIcon className="text-blue-600" size={20} />
              Images <span className="text-sm text-gray-500">(up to 10)</span>
            </h3>
            <div className="flex flex-col gap-2">
              <input 
                type="file" 
                name="images" 
                accept="image/*" 
                multiple 
                onChange={handleChange}
                className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" 
              />
              {form.images.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {form.images.map((img, idx) => (
                    <div key={idx} className="relative group w-20 h-20 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <img src={URL.createObjectURL(img)} alt={`Preview ${idx + 1}`} className="object-cover w-full h-full" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        title="Remove image"
                      >
                        <Trash2 className="text-white" size={28} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Videos Section */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Video className="text-purple-600" size={20} />
              Videos <span className="text-sm text-gray-500">(up to 10, max 500MB each)</span>
            </h3>
            
            <div className="flex flex-col gap-4">
              <input 
                type="file" 
                name="videos" 
                accept="video/*" 
                multiple 
                onChange={handleChange}
                className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" 
              />
              
              {/* Video Settings */}
              <div className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Settings className="text-gray-600" size={16} />
                  Video Settings
                </h4>
                
                {/* Audio Settings - Prominent */}
                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Volume2 className="text-blue-600" size={18} />
                    <span className="font-semibold text-blue-700 dark:text-blue-300">Audio Settings</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="video_muted"
                        checked={videoSettings.video_muted}
                        onChange={(e) => handleVideoSettingsChange('video_muted', e.target.checked)}
                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="video_muted" className="text-sm font-medium">
                        {videoSettings.video_muted ? 'Muted (No Audio)' : 'Audio Enabled'}
                      </label>
                    </div>
                    {videoSettings.video_muted ? (
                      <VolumeX className="text-red-500" size={16} />
                    ) : (
                      <Volume2 className="text-green-500" size={16} />
                    )}
                  </div>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    {videoSettings.video_muted 
                      ? 'Video will be uploaded without audio' 
                      : 'Video will include audio track'
                    }
                  </p>
                </div>
                
                {/* Other Video Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="video_autoplay"
                      checked={videoSettings.video_autoplay}
                      onChange={(e) => handleVideoSettingsChange('video_autoplay', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="video_autoplay" className="text-sm font-medium">Autoplay</label>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="video_loop"
                      checked={videoSettings.video_loop}
                      onChange={(e) => handleVideoSettingsChange('video_loop', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="video_loop" className="text-sm font-medium">Loop</label>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <label htmlFor="order_index" className="text-sm font-medium">Order Index:</label>
                    <input
                      type="number"
                      id="order_index"
                      value={videoSettings.order_index}
                      onChange={(e) => handleVideoSettingsChange('order_index', parseInt(e.target.value) || 0)}
                      className="w-16 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm bg-white dark:bg-gray-800"
                      min="0"
                    />
                  </div>
                </div>
                
                <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                  <p>• <strong>Audio is enabled by default</strong> - uncheck "Muted" to preserve audio in your videos</p>
                  <p>• Autoplay videos are automatically muted to comply with browser policies</p>
                  <p>• Order index controls the display sequence of videos</p>
                  <p>• Supported formats: MP4, MOV, AVI, WebM (max 500MB per file)</p>
                </div>
              </div>

              {/* Video Previews */}
              {form.videos.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Selected Videos:</h4>
                  {form.videos.map((video, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                      <div className="flex items-center gap-3">
                        <Video className="text-purple-600" size={20} />
                        <div>
                          <div className="font-medium text-sm">{video.name}</div>
                          <div className="text-xs text-gray-500">{formatFileSize(video.size)}</div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveVideo(idx)}
                        className="p-1 text-red-600 hover:text-red-800 transition-colors"
                        title="Remove video"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4 mt-10">
        <button type="submit" disabled={loading} className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold text-lg shadow hover:bg-blue-700 transition disabled:opacity-60">
          {loading ? <Loader2 className="animate-spin" size={22} /> : <ImageIcon size={22} />} 
          {loading ? 'Uploading...' : 'Create Project'}
        </button>
        {error && <div className="text-red-600 flex items-center gap-2"><AlertCircle size={20} />{error}</div>}
        {success && <div className="text-green-600 flex items-center gap-2"><CheckCircle size={20} />{success}</div>}
      </div>
    </form>
  );
};

export default ProjectUploadForm; 