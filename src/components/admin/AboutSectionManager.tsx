import React, { useEffect, useState } from 'react';
import homepageService, { HomepageElement } from '../../services/homepageService';

const AboutSectionManager: React.FC = () => {
  const [element, setElement] = useState<HomepageElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    is_active: true,
    media_file: null as File | null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fetchElement = async () => {
    setLoading(true);
    setError(null);
    try {
      const elements = await homepageService.getElementsByType('about', false);
      setElement(elements && elements.length > 0 ? elements[0] : null);
      if (elements && elements.length > 0) {
        setForm({
          title: elements[0].title || '',
          description: elements[0].description || '',
          is_active: elements[0].is_active,
          media_file: null,
        });
      }
    } catch (e) {
      setError('Failed to fetch about section.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchElement();
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let fieldValue: any = value;
    if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
      fieldValue = e.target.checked;
    }
    setForm((f) => ({ ...f, [name]: fieldValue }));
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setForm((f) => ({ ...f, media_file: e.target.files![0] }));
      setPreviewUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData();
    formData.append('type', 'about');
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.set('is_active', form.is_active as any);
    if (form.media_file) formData.append('media_file', form.media_file);
    try {
      if (element) {
        await homepageService.updateElement(element.id, formData as any);
      } else {
        await homepageService.createElement(formData);
      }
      fetchElement();
      setPreviewUrl(null);
    } catch {
      alert('Failed to save.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!element) return;
    if (!window.confirm('Delete the About section?')) return;
    setSubmitting(true);
    try {
      await homepageService.deleteElement(element.id);
      setElement(null);
      setForm({ title: '', description: '', is_active: true, media_file: null });
    } catch {
      alert('Failed to delete.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-3xl font-extrabold mb-8 text-gray-900 dark:text-white tracking-tight">About Section <span className="text-blue-600">(Our Story)</span></h2>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-xl border border-gray-100 dark:border-gray-800">
          <div>
            <label className="block mb-2 font-semibold text-gray-800 dark:text-gray-200">Title</label>
            <input name="title" value={form.title} onChange={handleInput} required className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block mb-2 font-semibold text-gray-800 dark:text-gray-200">Description</label>
            <textarea name="description" value={form.description} onChange={handleInput} rows={5} required className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="flex items-center gap-3 mb-2">
            <input name="is_active" type="checkbox" checked={form.is_active} onChange={handleInput} id="is_active" className="accent-blue-600 w-5 h-5" />
            <label htmlFor="is_active" className="font-semibold text-gray-700 dark:text-gray-300">Active</label>
          </div>
          <div>
            <label className="block mb-2 font-semibold text-gray-800 dark:text-gray-200">Image</label>
            <input name="media_file" type="file" accept="image/*" onChange={handleFile} className="w-full" />
            {(previewUrl || element?.media_url) && (
              <div className="mt-4 flex justify-center">
                <img src={previewUrl || element?.media_url || ''} alt={form.title || 'About section'} className="w-full max-w-md h-64 object-cover rounded-xl border shadow-md" />
              </div>
            )}
          </div>
          <div className="flex gap-4 mt-4">
            <button type="submit" disabled={submitting} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">{submitting ? 'Saving...' : (element ? 'Update' : 'Create')}</button>
            {element && <button type="button" onClick={handleDelete} disabled={submitting} className="bg-red-100 text-red-700 px-6 py-2 rounded-lg font-semibold hover:bg-red-200 transition">Delete</button>}
          </div>
        </form>
      )}
    </div>
  );
};

export default AboutSectionManager; 