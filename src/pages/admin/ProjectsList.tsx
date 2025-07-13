import React, { useEffect, useState } from 'react';
import { fetchPublishedProjects } from '../../services/portfolioService';
import adminService from '../../services/adminService';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Plus, Search } from 'lucide-react';

const ProjectsList = () => {
  const [projects, setProjects] = useState<any[]>([]); // Changed type to any[] as PortfolioProject is removed
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const projs = await fetchPublishedProjects(1, 100);
      setProjects(projs || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (projectId: string) => {
    if (!window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) return;
    try {
      await adminService.deleteProject(projectId);
      fetchProjects();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete project');
    }
  };

  const filteredProjects = projects.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  // Helper to get preview for a project
  const getProjectPreview = (project: any) => {
    if (project.image_url) {
      return { type: 'image', src: project.image_url };
    } else if (Array.isArray(project.videos) && project.videos.length > 0 && project.videos[0].video_url) {
      return { type: 'video', src: project.videos[0].video_url };
    } else {
      return { type: 'image', src: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=600&fit=crop' };
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600 dark:text-red-400">{error}</div>;
  }

  return (
    <div className="space-y-6 px-2 md:px-6 lg:px-12 py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1">Projects Management</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">View, edit, or delete your portfolio projects</p>
        </div>
        <div className="flex gap-2 items-center w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <input
              type="text"
              placeholder="Search by title..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full md:w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
          <Link to="/admin/projects/new" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow">
            <Plus size={18} />
            <span className="hidden sm:inline">Add Project</span>
          </Link>
        </div>
      </div>

      {/* Responsive Table/Grid */}
      <div className="block md:hidden">
        {/* Mobile: Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredProjects.map((project) => {
            const preview = getProjectPreview(project);
            return (
              <div key={project.id} className="bg-white dark:bg-gray-900 rounded-xl shadow-md overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300">
                {preview.type === 'video' ? (
                  <video
                    src={preview.src}
                    className="w-full h-40 object-cover"
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    onMouseOver={e => (e.currentTarget as HTMLVideoElement).play()}
                    onMouseOut={e => (e.currentTarget as HTMLVideoElement).pause()}
                  />
                ) : (
                  <img
                    src={preview.src}
                    alt={project.title}
                    className="w-full h-40 object-cover"
                  />
                )}
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate mb-1">{project.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm truncate mb-2">{project.category}</p>
                  <div className="flex-1" />
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-xs px-2 py-1 rounded ${project.is_published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{project.is_published ? 'Published' : 'Draft'}</span>
                    <div className="flex gap-2 items-center">
                      <Link to={`/admin/projects/edit/${project.id}`} className="flex items-center justify-center p-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 active:scale-95 transition-all shadow-sm">
                        <Edit size={18} />
                      </Link>
                      <button onClick={() => deleteProject(project.id)} className="flex items-center justify-center p-2 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full hover:bg-red-200 dark:hover:bg-red-900/40 active:scale-95 transition-all shadow-sm">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="hidden md:block">
        {/* Desktop: Table */}
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Image</th>
                <th className="px-4 py-2 text-left">Title</th>
                <th className="px-4 py-2 text-left">Category</th>
                <th className="px-4 py-2 text-left">Published</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project) => {
                const preview = getProjectPreview(project);
                return (
                  <tr key={project.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/40 transition-colors">
                    <td className="px-4 py-2">
                      {preview.type === 'video' ? (
                        <video
                          src={preview.src}
                          className="w-20 h-16 object-cover rounded shadow"
                          muted
                          loop
                          playsInline
                          preload="metadata"
                          onMouseOver={e => (e.currentTarget as HTMLVideoElement).play()}
                          onMouseOut={e => (e.currentTarget as HTMLVideoElement).pause()}
                        />
                      ) : (
                        <img
                          src={preview.src}
                          alt={project.title}
                          className="w-20 h-16 object-cover rounded shadow"
                        />
                      )}
                    </td>
                    <td className="px-4 py-2 font-medium text-gray-900 dark:text-white max-w-xs truncate">{project.title}</td>
                    <td className="px-4 py-2 text-gray-700 dark:text-gray-300 max-w-xs truncate">{project.category}</td>
                    <td className="px-4 py-2 text-gray-700 dark:text-gray-300">
                      <span className={`text-xs px-2 py-1 rounded ${project.is_published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{project.is_published ? 'Published' : 'Draft'}</span>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex gap-2 items-center justify-center">
                        <Link to={`/admin/projects/edit/${project.id}`} className="flex items-center justify-center p-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 active:scale-95 transition-all shadow-sm">
                          <Edit size={18} />
                        </Link>
                        <button onClick={() => deleteProject(project.id)} className="flex items-center justify-center p-2 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full hover:bg-red-200 dark:hover:bg-red-900/40 active:scale-95 transition-all shadow-sm">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProjectsList; 