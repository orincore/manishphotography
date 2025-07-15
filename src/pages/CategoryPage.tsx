import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Section from '../components/common/Section';
import { formatProjectCount } from '../utils/portfolioHelpers';
import config from '../config';

const CategoryPage = () => {
  const { categorySlug } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  useEffect(() => {
    // Update page title
    if (category) {
      document.title = `${category.name} - Portfolio - Manish Photography`;
    }
  }, [category]);

  useEffect(() => {
    const fetchCategoryProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        setCategory(null);
        setProjects([]);
        // Use the correct endpoint for a single category
        const response = await fetch(`${config.api.baseURL}/portfolio/categories/${categorySlug}`);
        if (!response.ok) throw new Error('Category not found or no images available');
        const data = await response.json();
        // The API returns { message, snug, projects }
        if (data && Array.isArray(data.projects)) {
          if (data.projects.length > 0) {
            setCategory({
              id: '',
              name: categorySlug,
              slug: categorySlug,
              description: '',
              portfolio_subcategories: [],
              thumbnail_url: '',
              is_active: true,
              display_order: 0,
              created_at: '',
              updated_at: ''
            });
            setProjects(data.projects);
          } else {
            setError('No projects found for this category');
          }
        } else {
          setError('Category not found or no images available');
        }
      } catch (err: any) {
        setError('Category not found or no images available');
      } finally {
        setLoading(false);
      }
    };
    if (categorySlug) {
      fetchCategoryProjects();
    }
  }, [categorySlug]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const handleEditImage = (project: any, img: any) => {
    // TODO: Implement edit functionality
  };

  const handleDeleteImage = (project: any, img: any) => {
    // TODO: Implement delete functionality
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <Section title="Loading..." subtitle="">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading category...</p>
          </div>
        </Section>
      </div>
    );
  }

  if (
    error ||
    !category
  ) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <Section title="Category Not Found" subtitle="">
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="text-gray-400 dark:text-gray-500 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Category Not Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {error || 'The category you are looking for does not exist or has no content.'}
              </p>
              <Link 
                to="/portfolio"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Back to Portfolio
              </Link>
            </div>
          </div>
        </Section>
      </div>
    );
  }

  // If you are rendering a list of categories, filter them before rendering:
  // Example: categories.filter(cat => Array.isArray(cat.portfolio_subcategories) && cat.portfolio_subcategories.length > 0)
  // If you are rendering a single category (as in this page), the previous logic is correct.
  // If you have a categories list page, apply this filter before mapping over categories.
  return (
    <div className="min-h-screen pb-16">
      <Section subtitle={category.description}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-8">
            <Link to="/portfolio" className="hover:text-blue-600 dark:hover:text-blue-400">
              Portfolio
            </Link>
            <span>/</span>
            <span className="text-gray-900 dark:text-white">{category.name}</span>
          </nav>

          {/* Category Header */}
          <div className="mb-12">
            {category.description && (
              <div className="text-center">
                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                  {category.description}
                </p>
              </div>
            )}
          </div>

          {/* Subcategories Section */}
          {/* (Removed: category.portfolio_subcategories && category.portfolio_subcategories.length > 0) */}
          {/* Projects Grid Section */}
          {projects.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                Gallery
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.flatMap((project) => [
                  // Images
                  ...(Array.isArray(project.images) && project.images.length > 0
                    ? project.images.map((img: any, idx: number) => (
                        <div
                          key={`img-${project.id}-${img.id || idx}`}
                          className="relative bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden group transition-all duration-200 border border-gray-100 dark:border-gray-800 hover:shadow-2xl cursor-pointer"
                          onClick={() => navigate(`/portfolio/project/${project.id}`)}
                        >
                          <div className="relative">
                            <img
                              src={img.image_url || '/placeholder.jpg'}
                              alt={project.title}
                              className="w-full h-56 object-cover rounded-t select-none pointer-events-none border-b border-gray-200 dark:border-gray-700 hover:scale-105 transition-transform"
                              draggable={false}
                              onContextMenu={e => e.preventDefault()}
                            />
                          </div>
                          <div className="px-4 py-3">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 truncate drop-shadow-lg">{project.title}</h3>
                            <div className="text-sm text-gray-500 mb-1">
                              <span className="font-medium">Category:</span> {category?.name || ''}
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 mb-2 line-clamp-2 min-h-[2.5em]">{project.description}</p>
                            {project.tags && project.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-2">
                                {project.tags.map((tag: string) => (
                                  <span key={tag} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">{tag}</span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    : []),
                  // Videos
                  ...(Array.isArray(project.videos) && project.videos.length > 0
                    ? project.videos.map((video: any, idx: number) => (
                        <div
                          key={`video-${project.id}-${video.id || idx}`}
                          className="relative bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden group transition-all duration-200 border border-gray-100 dark:border-gray-800 hover:shadow-2xl cursor-pointer"
                          onClick={() => navigate(`/portfolio/project/${project.id}`)}
                        >
                          <div className="relative">
                            <video
                              src={video.video_url}
                              poster={video.video_thumbnail_url || project.thumbnail_url || undefined}
                              className="w-full h-56 object-cover rounded-t select-none pointer-events-none border-b border-gray-200 dark:border-gray-700 hover:scale-105 transition-transform"
                              muted
                              loop
                              playsInline
                              preload="metadata"
                              onMouseOver={e => (e.currentTarget as HTMLVideoElement).play()}
                              onMouseOut={e => (e.currentTarget as HTMLVideoElement).pause()}
                            />
                            {/* Video indicator */}
                            <div className="absolute top-3 right-3 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 pointer-events-none">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z"/>
                              </svg>
                              Video
                            </div>
                          </div>
                          <div className="px-4 py-3">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 truncate drop-shadow-lg">{project.title}</h3>
                            <div className="text-sm text-gray-500 mb-1">
                              <span className="font-medium">Category:</span> {category?.name || ''}
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 mb-2 line-clamp-2 min-h-[2.5em]">{project.description}</p>
                            {project.tags && project.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-2">
                                {project.tags.map((tag: string) => (
                                  <span key={tag} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">{tag}</span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    : [])
                ])}
              </div>
            </div>
          )}

        </motion.div>
      </Section>
      
      {/* Fullscreen Image Modal */}
      {fullscreenImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
          onClick={() => setFullscreenImage(null)}
        >
          <img
            src={fullscreenImage}
            alt="Full Size"
            className="max-w-full max-h-full rounded shadow-lg select-none pointer-events-none"
            onClick={e => e.stopPropagation()}
            draggable={false}
            onContextMenu={e => e.preventDefault()}
          />
          <button
            className="absolute top-6 right-6 text-white text-3xl font-bold bg-black bg-opacity-50 rounded-full px-4 py-2 hover:bg-opacity-80 transition"
            onClick={() => setFullscreenImage(null)}
            aria-label="Close"
          >
            &times;
          </button>
        </div>
      )}
    </div>
  );
};

export default CategoryPage; 