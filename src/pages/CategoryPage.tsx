import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Section from '../components/common/Section';
import portfolioService, { PortfolioCategory } from '../services/portfolioService';
import { formatProjectCount } from '../utils/portfolioHelpers';
import { useState as useReactState } from 'react';

const CategoryPage = () => {
  const { categorySlug } = useParams();
  const [category, setCategory] = useState<PortfolioCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [fullscreenImage, setFullscreenImage] = useReactState<string | null>(null);

  useEffect(() => {
    // Update page title
    if (category) {
      document.title = `${category.name} - Portfolio - Manish Photography`;
    }
  }, [category]);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await portfolioService.getCategoryBySlug(categorySlug!);
        if ('category' in response && response.category) {
          setCategory(response.category);
          setProjects([]);
        } else if ('snug' in response && 'projects' in response) {
          // Fallback: create a minimal category object
          setCategory({
            id: '',
            name: String(response.snug),
            slug: String(response.snug),
            description: '',
            portfolio_subcategories: [],
            thumbnail_url: '',
            is_active: true,
            display_order: 0,
            created_at: '',
            updated_at: ''
          });
          setProjects(Array.isArray(response.projects) ? response.projects : []);
        } else {
          setError('Category not found or no images available');
          setProjects([]);
        }
      } catch (err: any) {
        console.error('Error fetching category:', err);
        setError('Category not found or no images available');
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    if (categorySlug) {
      fetchCategory();
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
    // TODO: Implement edit logic (e.g., navigate to edit page or open modal)
    alert(`Edit image for project: ${project.title}`);
  };
  const handleDeleteImage = (project: any, img: any) => {
    // TODO: Implement delete logic (e.g., API call, confirmation)
    alert(`Delete image for project: ${project.title}`);
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

  if (error || !category) {
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
                {error || 'The category you are looking for does not exist.'}
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
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Client Portfolios
            </h2>
            {category.portfolio_subcategories.length > 0 && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {category.portfolio_subcategories.map((subcategory) => (
                  <motion.div key={subcategory.id} variants={itemVariants}>
                    <Link to={`/portfolio/${category.slug}/${subcategory.slug}`}>
                      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                        <div className="aspect-[4/3] overflow-hidden">
                          <img
                            src={subcategory.cover_image_url || category.thumbnail_url || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop'}
                            alt={subcategory.name}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop';
                            }}
                          />
                        </div>
                        <div className="p-6">
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            {subcategory.name}
                          </h3>
                          {subcategory.description && (
                            <p className="text-gray-600 dark:text-gray-400 mb-2">
                              {subcategory.description}
                            </p>
                          )}
                          <p className="text-gray-600 dark:text-gray-400 mb-2">
                            {subcategory.client_name}
                          </p>
                          <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-500">
                            <span>{formatProjectCount(subcategory)}</span>
                            {subcategory.event_date && (
                              <span>{new Date(subcategory.event_date).toLocaleDateString()}</span>
                            )}
                          </div>
                          <div className="mt-4">
                            <span className="inline-block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                              View Gallery
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Projects Grid Section */}
          {projects.length > 0 && (
            <div className="mb-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.flatMap((project) => (
                  Array.isArray(project.images) && project.images.length > 0
                    ? project.images.map((img: any, idx: number) => (
                        <div
                          key={project.id + '-' + (img.image_url || idx)}
                          className="relative bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden group transition-all duration-200 border border-gray-100 dark:border-gray-800 hover:shadow-2xl"
                        >
                          <div className="relative">
                            <img
                              src={img.image_url || '/placeholder.jpg'}
                              alt={project.title}
                              className="w-full h-56 object-cover rounded-t select-none pointer-events-auto border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:scale-105 transition-transform"
                              draggable={false}
                              onContextMenu={e => e.preventDefault()}
                              onClick={() => setFullscreenImage(img.image_url)}
                            />
                            {/* Edit/Delete overlay */}
                            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                              <button
                                type="button"
                                onClick={() => handleEditImage(project, img)}
                                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 shadow focus:outline-none"
                                title="Edit image"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-1.414.828l-4.243 1.415a1 1 0 01-1.263-1.263l1.415-4.243a4 4 0 01.828-1.414z" /></svg>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteImage(project, img)}
                                className="bg-red-600 hover:bg-red-700 text-white rounded-full p-2 shadow focus:outline-none"
                                title="Delete image"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                              </button>
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
                    : [
                        <div
                          key={project.id + '-single'}
                          className="relative bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden group transition-all duration-200 border border-gray-100 dark:border-gray-800 hover:shadow-2xl"
                        >
                          <img
                            src={project.image_url || '/placeholder.jpg'}
                            alt={project.title}
                            className="w-full h-56 object-cover rounded-t select-none pointer-events-auto border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:scale-105 transition-transform"
                            draggable={false}
                            onContextMenu={e => e.preventDefault()}
                            onClick={() => setFullscreenImage(project.image_url)}
                          />
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
                      ]
                ))}
              </div>
            </div>
          )}
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
        </motion.div>
      </Section>
    </div>
  );
};

export default CategoryPage; 