import React, { useEffect, useState, ChangeEvent } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { fetchCategories, PortfolioCategory, createCategory as createCategoryService } from '../../services/portfolioService';
import { ArrowLeft, Save, PlusCircle, Loader2, CheckCircle, AlertCircle, Image as ImageIcon } from 'lucide-react';

const EditProject = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [categories, setCategories] = useState<PortfolioCategory[]>([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    tags: '',
    isPublished: false,
    image_url: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  const [newCategoryOrder, setNewCategoryOrder] = useState(10);
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [categoryError, setCategoryError] = useState('');
  const [projectImages, setProjectImages] = useState<any[]>([]);

  useEffect(() => {
    fetchProject();
    fetchCategoriesList();
    // eslint-disable-next-line
  }, [projectId]);

  const fetchCategoriesList = async () => {
    try {
      const cats = await fetchCategories();
      setCategories(cats);
    } catch {}
  };

  const fetchProject = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('authToken');
      const res = await axios.get(`http://localhost:3000/api/portfolio/${projectId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const project = res.data.project;
      setForm({
        title: project.title || '',
        description: project.description || '',
        category: project.category || '',
        tags: (project.tags || []).join(', '),
        isPublished: !!project.is_published,
        image_url: project.image_url || '',
      });
      setProjectImages(Array.isArray(project.images) ? project.images : []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch project');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setForm((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
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
      const newCat = await createCategoryService(newCategoryName.trim(), newCategoryDescription, newCategoryOrder);
      setCategories((prev) => [...prev, newCat]);
      setForm(f => ({ ...f, category: newCat.slug }));
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

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setForm((prev) => ({ ...prev, image_url: URL.createObjectURL(e.target.files![0]) }));
    }
  };

  const handleEditImage = (img: any) => {
    // TODO: Implement edit logic (e.g., open modal)
    alert(`Edit image: ${img.image_url}`);
  };
  const handleDeleteImage = async (img: any) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      await axios.delete(`http://localhost:3000/api/portfolio/${projectId}/images/${img.id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setProjectImages((prev) => prev.filter((i) => i.id !== img.id));
      setSuccess('Image deleted successfully!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete image');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('category', form.category);
      formData.append('tags', JSON.stringify(form.tags.split(',').map((t) => t.trim()).filter(Boolean)));
      formData.append('isPublished', String(form.isPublished));
      if (imageFile) {
        formData.append('image', imageFile);
      }
      const token = localStorage.getItem('authToken');
      await axios.put(`http://localhost:3000/api/portfolio/${projectId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      setSuccess('Project updated successfully!');
      setTimeout(() => navigate('/admin/projects'), 1200);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update project');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-blue-600" size={48} /></div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600 dark:text-red-400 flex items-center justify-center gap-2"><AlertCircle size={24} />{error}</div>;
  }

  return (
    <div className="max-w-4xl w-full mx-auto py-8 px-2 md:px-0">
      <div className="flex items-center mb-6 gap-2">
        <Link to="/admin/projects" className="flex items-center gap-1 text-blue-600 hover:underline">
          <ArrowLeft size={18} /> Back to Projects
        </Link>
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 md:p-12">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">Edit Project</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Update your portfolio project details below.</p>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8" encType="multipart/form-data">
          <div className="flex flex-col gap-4">
            <div>
              <label className="block font-semibold mb-1">Title</label>
              <input type="text" name="title" value={form.title} onChange={handleChange} required className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition" />
            </div>
            <div>
              <label className="block font-semibold mb-1">Tags <span className="text-xs text-gray-400">(comma separated)</span></label>
              <input type="text" name="tags" value={form.tags} onChange={handleChange} className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition" />
            </div>
            <div>
              <label className="block font-semibold mb-1">Category</label>
              <select name="category" value={form.category} onChange={handleChange} required className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition">
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.slug}>{cat.name}</option>
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
            <div className="flex items-center gap-3 mt-2">
              <input type="checkbox" name="isPublished" checked={form.isPublished} onChange={handleChange} id="isPublished" className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
              <label htmlFor="isPublished" className="font-semibold">Published</label>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div>
              <label className="block font-semibold mb-1">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} required className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 min-h-[100px] bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition" />
            </div>
            <div>
              <label className="block font-semibold mb-1">Image</label>
              <input type="file" name="image" accept="image/*" onChange={handleImageChange} className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
              {form.image_url && (
                <div className="w-32 h-32 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 flex items-center justify-center mt-2">
                  <img src={form.image_url} alt="Project" className="object-cover w-full h-full" />
                </div>
              )}
            </div>
          </div>
          <div className="md:col-span-2 flex flex-col md:flex-row items-center gap-4 mt-10">
            <button type="submit" disabled={saving} className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold text-lg shadow hover:bg-blue-700 transition disabled:opacity-60">
              {saving ? <Loader2 className="animate-spin" size={22} /> : <Save size={22} />} {saving ? 'Saving...' : 'Save Changes'}
            </button>
            {success && <div className="text-green-600 flex items-center gap-2"><CheckCircle size={20} />{success}</div>}
            {error && <div className="text-red-600 flex items-center gap-2"><AlertCircle size={20} />{error}</div>}
          </div>
        </form>
        {/* Images grid for editing/deleting */}
        {projectImages.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Project Images</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {projectImages.map((img: any, idx: number) => (
                <div key={img.id || idx} className="relative group rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
                  <img
                    src={img.image_url || '/placeholder.jpg'}
                    alt={form.title}
                    className="w-full h-48 object-cover select-none pointer-events-auto cursor-pointer hover:scale-105 transition-transform"
                    draggable={false}
                    onContextMenu={e => e.preventDefault()}
                  />
                  {/* Edit/Delete overlay */}
                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button
                      type="button"
                      onClick={() => handleEditImage(img)}
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 shadow focus:outline-none"
                      title="Edit image"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-1.414.828l-4.243 1.415a1 1 0 01-1.263-1.263l1.415-4.243a4 4 0 01.828-1.414z" /></svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(img)}
                      className="bg-red-600 hover:bg-red-700 text-white rounded-full p-2 shadow focus:outline-none"
                      title="Delete image"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditProject; 