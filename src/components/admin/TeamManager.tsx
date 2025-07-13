import React, { useEffect, useState } from 'react';
import teamService, { TeamMember } from '../../services/teamService';
import Card from '../common/Card';

const API_BASE = '/api/team';

const getToken = () => localStorage.getItem('authToken');

const TeamManager: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [form, setForm] = useState({
    name: '',
    role: '',
    bio: '',
    is_active: true,
    photo: null as File | null,
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchMembers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}`);
      const data = await res.json();
      setMembers(data.members.sort((a: TeamMember, b: TeamMember) => a.order_index - b.order_index));
    } catch (e) {
      setError('Failed to fetch team members.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let fieldValue: any = value;
    if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
      fieldValue = e.target.checked;
    }
    setForm((f) => ({
      ...f,
      [name]: fieldValue,
    }));
  };

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setForm((f) => ({ ...f, photo: e.target.files![0] }));
    }
  };

  const resetForm = () => {
    setForm({ name: '', role: '', bio: '', is_active: true, photo: null });
    setEditing(null);
  };

  const handleEdit = (member: TeamMember) => {
    setEditing(member);
    setForm({
      name: member.name,
      role: member.role,
      bio: member.bio,
      is_active: member.is_active,
      photo: null,
    });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this team member?')) return;
    setSubmitting(true);
    try {
      await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      fetchMembers();
    } catch {
      alert('Failed to delete.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('role', form.role);
    formData.append('bio', form.bio);
    // Assign order_index automatically for new members
    if (editing) {
      formData.append('order_index', String(editing.order_index));
    } else {
      const maxOrder = members.length > 0 ? Math.max(...members.map(m => m.order_index || 0)) : 0;
      formData.append('order_index', String(maxOrder + 1));
    }
    formData.append('is_active', String(form.is_active));
    if (form.photo) formData.append('photo', form.photo);
    try {
      if (editing) {
        await fetch(`${API_BASE}/${editing.id}`, {
          method: 'PUT',
          headers: { Authorization: `Bearer ${getToken()}` },
          body: formData,
        });
      } else {
        await fetch(`${API_BASE}`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${getToken()}` },
          body: formData,
        });
      }
      fetchMembers();
      resetForm();
    } catch {
      alert('Failed to submit.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Team Members</h2>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
          {members.map((m) => (
            <Card key={m.id} className="flex flex-col items-center p-5 bg-white rounded-xl shadow group border border-gray-100 hover:shadow-blue-100 transition-shadow">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-400 shadow mb-3">
                <img src={m.photo_url} alt={m.name} className="w-full h-full object-cover" />
              </div>
              <div className="text-center">
                <div className="font-bold text-lg text-gray-900 mb-1">{m.name}</div>
                <div className="text-blue-600 font-semibold mb-1 uppercase text-xs tracking-wide">{m.role}</div>
                <div className="text-gray-600 text-sm mb-2">{m.bio}</div>
                <div className="flex gap-2 justify-center mt-2">
                  <button className="text-blue-600 hover:underline text-xs" onClick={() => handleEdit(m)}>Edit</button>
                  <button className="text-red-500 hover:underline text-xs" onClick={() => handleDelete(m.id)} disabled={submitting}>Delete</button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-lg mb-4">{editing ? 'Edit Team Member' : 'Add Team Member'}</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Name</label>
            <input name="name" value={form.name} onChange={handleInput} required className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block mb-1 font-medium">Role</label>
            <input name="role" value={form.role} onChange={handleInput} required className="w-full border rounded px-3 py-2" />
          </div>
          <div className="md:col-span-2">
            <label className="block mb-1 font-medium">Bio</label>
            <textarea name="bio" value={form.bio} onChange={handleInput} rows={2} className="w-full border rounded px-3 py-2" />
          </div>
          {/* Order Index input removed */}
          <div className="flex items-center gap-2">
            <input name="is_active" type="checkbox" checked={form.is_active} onChange={handleInput} id="is_active" />
            <label htmlFor="is_active" className="font-medium">Active</label>
          </div>
          <div className="md:col-span-2">
            <label className="block mb-1 font-medium">Photo</label>
            <input name="photo" type="file" accept="image/*" onChange={handlePhoto} className="w-full" />
          </div>
          <div className="md:col-span-2 flex gap-3 mt-2">
            <button type="submit" disabled={submitting} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">{submitting ? 'Saving...' : (editing ? 'Update' : 'Add')}</button>
            {editing && <button type="button" onClick={resetForm} className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition">Cancel</button>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeamManager; 