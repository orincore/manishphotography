import React, { useEffect, useState } from 'react';
import packageService, { Package } from '../../services/packageService';
import { PlusCircle, Trash2, Edit2, Save, X } from 'lucide-react';

const defaultForm = {
  name: '',
  color: '',
  features: '', // comma-separated for input
  note: '',
  display_order: 1,
};

type FormState = typeof defaultForm & { id?: string };

const PackageManager: React.FC = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [form, setForm] = useState<FormState>(defaultForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const data = await packageService.getAll();
      setPackages(data.packages);
    } catch (err: any) {
      setError('Failed to fetch packages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleEdit = (pkg: Package) => {
    setEditingId(pkg.id);
    setForm({
      id: pkg.id,
      name: pkg.name,
      color: pkg.color,
      features: pkg.features.join(', '),
      note: pkg.note || '',
      display_order: pkg.display_order || 1,
    });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this package?')) return;
    setLoading(true);
    try {
      await packageService.remove(id);
      fetchPackages();
    } catch {
      setError('Failed to delete package');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        name: form.name,
        color: form.color,
        features: form.features.split(',').map(f => f.trim()).filter(Boolean),
        note: form.note,
        display_order: Number(form.display_order) || 1,
      };
      if (editingId && form.id) {
        await packageService.update(form.id, payload);
      } else {
        await packageService.create(payload);
      }
      setForm(defaultForm);
      setEditingId(null);
      fetchPackages();
    } catch {
      setError('Failed to save package');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setForm(defaultForm);
    setEditingId(null);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg mt-8">
      <h2 className="text-2xl font-bold mb-4">Manage Packages</h2>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <form onSubmit={handleSubmit} className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Package Name" required className="border rounded px-3 py-2" />
        <input name="color" value={form.color} onChange={handleChange} placeholder="Color (e.g. green, blue)" required className="border rounded px-3 py-2" />
        <input name="display_order" value={form.display_order} onChange={handleChange} type="number" min={1} placeholder="Display Order" className="border rounded px-3 py-2" />
        <textarea name="features" value={form.features} onChange={handleChange} placeholder="Features (comma separated)" rows={2} className="border rounded px-3 py-2 md:col-span-2" />
        <input name="note" value={form.note} onChange={handleChange} placeholder="Note (optional)" className="border rounded px-3 py-2 md:col-span-2" />
        <div className="flex gap-2 mt-2 md:col-span-2">
          <button type="submit" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition disabled:opacity-60" disabled={loading}>
            {editingId ? <Edit2 size={18} /> : <PlusCircle size={18} />} {editingId ? 'Update' : 'Add'}
          </button>
          {editingId && (
            <button type="button" onClick={handleCancel} className="flex items-center gap-2 bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded transition">
              <X size={18} /> Cancel
            </button>
          )}
        </div>
      </form>
      <h3 className="text-xl font-semibold mb-2">All Packages</h3>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {packages.map(pkg => (
          <div key={pkg.id} className="flex flex-col md:flex-row md:items-center justify-between py-3 gap-2">
            <div>
              <span className="font-bold" style={{ color: pkg.color }}>{pkg.name}</span>
              <span className="ml-2 text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">Order: {pkg.display_order}</span>
              <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">{pkg.features.join(', ')}</div>
              {pkg.note && <div className="text-xs text-gray-500 mt-1">{pkg.note}</div>}
            </div>
            <div className="flex gap-2 mt-2 md:mt-0">
              <button onClick={() => handleEdit(pkg)} className="p-2 bg-yellow-400 hover:bg-yellow-500 text-white rounded transition"><Edit2 size={16} /></button>
              <button onClick={() => handleDelete(pkg.id)} className="p-2 bg-red-600 hover:bg-red-700 text-white rounded transition"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
        {packages.length === 0 && <div className="text-gray-500 py-4">No packages found.</div>}
      </div>
    </div>
  );
};

export default PackageManager; 