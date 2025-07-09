import React, { useState, useEffect } from 'react';
import { createPortfolioProject, fetchCategories, fetchSubcategories, createCategory } from '../../services/portfolioService';
import { PlusCircle, Image as ImageIcon, Loader2, CheckCircle, AlertCircle, Trash2 } from 'lucide-react';
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
      setForm(f => ({ ...f, images: fileArray }));
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

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      setCategoryError('Category name is required');
      return;
    }
    setCreatingCategory(true);
    setCategoryError('');
    try {
      const newCat = await createCategory(newCategoryName.trim(), newCategoryDescription, newCategoryOrder);
      setCategories((prev) => [...prev, newCat]);
      setForm(f => ({ ...f, category: newCat.id }));
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
    // Validate at least one image
    if (!form.images || form.images.length === 0) {
      setError('At least one image is required.');
      setLoading(false);
      return;
    }
    try {
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
      form.images.forEach(img => {
        formData.append('images', img);
      });
      // Use the api instance for correct baseURL and auth
      await api.post('/portfolio/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 300000, // 5 minutes
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            setUploadProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
          }
        },
      });
      setSuccess('Project created successfully!');
      setForm({ title: '', description: '', category: '', subcategoryId: '', tags: '', isPublished: true, images: [] });
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

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data" className="max-w-4xl w-full mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 md:p-12 mt-6 mb-10">
      <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900 dark:text-white">Upload New Portfolio Project</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-6">Fill in the details below to add a new project to your portfolio.</p>
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col gap-4">
          <div>
            <label className="block font-semibold mb-1">Title</label>
            <input name="title" value={form.title} onChange={handleChange} required className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition" />
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
        </div>
        <div className="flex flex-col gap-4">
          <div>
            <label className="block font-semibold mb-1">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} required className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 min-h-[100px] bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition" />
          </div>
          <div>
            <label className="block font-semibold mb-1">Images <span className="text-xs text-gray-400">(up to 10)</span></label>
            <div className="flex flex-col gap-2">
              <input type="file" name="images" accept="image/*" multiple onChange={handleChange} required className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
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
          <div className="flex items-center gap-3 mt-2">
            <input type="checkbox" name="isPublished" checked={form.isPublished} onChange={handleChange} id="isPublished" className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
            <label htmlFor="isPublished" className="font-semibold">Published</label>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-center gap-4 mt-10">
        <button type="submit" disabled={loading} className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold text-lg shadow hover:bg-blue-700 transition disabled:opacity-60">
          {loading ? <Loader2 className="animate-spin" size={22} /> : <ImageIcon size={22} />} {loading ? 'Uploading...' : 'Create Project'}
        </button>
        {error && <div className="text-red-600 flex items-center gap-2"><AlertCircle size={20} />{error}</div>}
        {success && <div className="text-green-600 flex items-center gap-2"><CheckCircle size={20} />{success}</div>}
      </div>
    </form>
  );
};

export default ProjectUploadForm; 