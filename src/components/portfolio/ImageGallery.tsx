import React, { useEffect, useState } from 'react';
import { fetchPublishedProjects, fetchCategoryById, fetchCategoryBySnug } from '../../services/portfolioService';

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  image_url: string | null;
  thumbnail_url: string | null;
  is_published: boolean;
  created_at: string;
  snug?: string;
  portfolio_subcategories?: any;
  images?: { thumbnail_url: string | null; image_url: string | null }[];
}

interface ImageGalleryProps {
  categorySnug?: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ categorySnug }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categoryName, setCategoryName] = useState<string>('');
  const [categoryMap, setCategoryMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (categorySnug) {
        // Fetch projects for a specific category snug
        const response = await fetchCategoryBySnug(categorySnug);
        // response: { message, snug, projects } or { category, projects }
        let catName = categorySnug;
        let projs: Project[] = [];
        if ('category' in response && response.category) {
          catName = response.category.name || categorySnug;
          projs = response.projects || [];
        } else if ('name' in response) {
          catName = response.name || categorySnug;
          projs = response.projects || [];
        } else if ('projects' in response) {
          projs = response.projects;
        }
        setCategoryName(catName);
        setProjects(projs);
        setCategoryMap({ [categorySnug]: catName });
      } else {
        // Fetch all published projects
        const projs = await fetchPublishedProjects(1, 10);
        setProjects(projs);
        // Map category IDs/snugs to names
        const uniqueCategoryKeys = Array.from(new Set(projs.map((p: Project) => String(p.category)).filter(Boolean)));
        const catMap: Record<string, string> = {};
        await Promise.all(uniqueCategoryKeys.map(async (catKey) => {
          if (typeof catKey === 'string' && catKey && !catMap[catKey]) {
            try {
              const cat = await fetchCategoryById(catKey);
              if (cat && cat.name) {
                catMap[catKey] = cat.name;
              } else if (cat && cat.category && cat.category.name) {
                catMap[catKey] = cat.category.name;
              } else {
                catMap[catKey] = catKey;
              }
            } catch {
              catMap[catKey] = catKey;
            }
          }
        }));
        setCategoryMap(catMap);
      }
      setLoading(false);
    };
    fetchData();
  }, [categorySnug]);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div>
      {categorySnug && (
        <h2 className="text-2xl font-bold mb-6">Category: {categoryName}</h2>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => {
          let catKey = project.category;
          let catDisplay = categoryMap[catKey] || catKey;
          if (categorySnug) catDisplay = categoryName;
          // Use images array if present, otherwise fallback
          const images = Array.isArray(project.images) && project.images.length > 0
            ? project.images.map(img => img.thumbnail_url || img.image_url || '/placeholder.jpg')
            : [project.thumbnail_url || project.image_url || '/placeholder.jpg'];
          return (
            <div key={project.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((imgUrl, idx) => (
                  <img
                    key={(imgUrl || '/placeholder.jpg') + idx}
                    src={imgUrl || '/placeholder.jpg'}
                    alt={project.title}
                    className="w-32 h-32 object-cover rounded mb-3 border border-gray-200 dark:border-gray-700 flex-shrink-0"
                  />
                ))}
              </div>
              <h3 className="text-lg font-bold mb-1">{project.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-2">{project.description}</p>
              <div className="text-sm text-gray-500 mb-1">
                <span className="font-medium">Category:</span> {catDisplay}
              </div>
              {project.tags && project.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">{tag}</span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ImageGallery;