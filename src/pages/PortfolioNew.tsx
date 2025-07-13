import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Section from '../components/common/Section';
import ProjectGrid from '../components/portfolio/ProjectGrid';
import portfolioService, { 
  PortfolioCategory, 
  PortfolioProject, 
  PortfolioSubcategory 
} from '../services/portfolioService';
import { formatProjectCount } from '../utils/portfolioHelpers';

const PortfolioNew = () => {
  const { categorySlug, subcategorySlug } = useParams();
  const [searchParams] = useSearchParams();
  
  const [categories, setCategories] = useState<PortfolioCategory[]>([]);
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentCategory, setCurrentCategory] = useState<PortfolioCategory | null>(null);
  const [currentSubcategory, setCurrentSubcategory] = useState<PortfolioSubcategory | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    // Update page title
    document.title = 'Portfolio - Manish Photography';
  }, []);

  // Fetch all categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await portfolioService.getCategories();
        setCategories(response.categories);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load categories');
      }
    };

    fetchCategories();
  }, []);

  // Fetch data based on current route
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (categorySlug && subcategorySlug) {
          // Fetch specific subcategory
          try {
            const response = await portfolioService.getSubcategoryBySlug(categorySlug, subcategorySlug);
            setCurrentSubcategory(response.subcategory);
            setProjects(response.subcategory.portfolio_projects || []);
            setCurrentCategory(null);
            setHasMore(false);
          } catch (err: any) {
            console.error('Error fetching subcategory:', err);
            setError('Subcategory not found or no projects available');
            setCurrentSubcategory(null);
            setProjects([]);
            setHasMore(false);
          }
        } else if (categorySlug) {
          // Fetch specific category
          try {
            const response = await portfolioService.getCategoryBySlug(categorySlug);
            setCurrentCategory(response.category);
            setCurrentSubcategory(null);
            setProjects([]);
            setHasMore(false);
          } catch (err: any) {
            // If category not found, try to get it from the categories list
            const category = categories.find(cat => cat.slug === categorySlug);
            if (category) {
              setCurrentCategory(category);
              setCurrentSubcategory(null);
              setProjects([]);
              setHasMore(false);
            } else {
              throw err;
            }
          }
        } else {
          // For "All Work" view, we'll use the ProjectGrid component
          setProjects([]);
          setHasMore(false);
          setCurrentCategory(null);
          setCurrentSubcategory(null);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categorySlug, subcategorySlug, currentPage]);

  const loadMore = () => {
    if (!loading && hasMore) {
      setCurrentPage(prev => prev + 1);
    }
  };

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

  if (loading && projects.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <Section title="Our Portfolio" subtitle="Explore our photography and cinematography work">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading portfolio...</p>
          </div>
        </Section>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <Section title="Our Portfolio" subtitle="Explore our photography and cinematography work">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Navigation */}
          <div className="mb-8">
            <nav className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/portfolio"
                className={`px-4 py-2 rounded-lg transition-colors ${
                  !categorySlug
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                All Work
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/portfolio/${category.slug}`}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    categorySlug === category.slug
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {category.name}
                </Link>
              ))}
            </nav>
          </div>

          {error && (
            <div className="text-center py-8">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Category Header */}
          {currentCategory && (
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {currentCategory.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                {currentCategory.description}
              </p>
            </div>
          )}

          {/* Subcategory Header */}
          {currentSubcategory && (
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {currentSubcategory.name}
              </h2>
              {currentSubcategory.description && (
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-4">
                  {currentSubcategory.description}
                </p>
              )}
              <div className="text-gray-600 dark:text-gray-400 space-y-2">
                <p>Client: {currentSubcategory.client_name}</p>
                {currentSubcategory.event_date && (
                  <p>Date: {new Date(currentSubcategory.event_date).toLocaleDateString()}</p>
                )}
                {currentSubcategory.location && (
                  <p>Location: {currentSubcategory.location}</p>
                )}
                {currentSubcategory.portfolio_projects && (
                  <p>Photos: {currentSubcategory.portfolio_projects.length}</p>
                )}
              </div>
            </div>
          )}

          {/* Subcategories Grid (when viewing a category) */}
          {currentCategory && !subcategorySlug && (
            <>
              {currentCategory.portfolio_subcategories.length > 0 ? (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
                >
                  {currentCategory.portfolio_subcategories.map((subcategory) => (
                    <motion.div key={subcategory.id} variants={itemVariants}>
                      <Link to={`/portfolio/${categorySlug}/${subcategory.slug}`}>
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                          <div className="aspect-[4/3] overflow-hidden">
                            <img
                              src={subcategory.cover_image_url}
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
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <div className="text-center py-12">
                  <div className="max-w-md mx-auto">
                    <div className="text-gray-400 dark:text-gray-500 mb-4">
                      <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      No Sessions Available
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      We're currently preparing amazing {currentCategory.name.toLowerCase()} sessions. Check back soon!
                    </p>
                    <div className="space-y-2 text-sm text-gray-500 dark:text-gray-500">
                      <p>• Professional photography sessions</p>
                      <p>• Beautiful locations and settings</p>
                      <p>• High-quality images and albums</p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Projects Grid - Show ProjectGrid for "All Work" view */}
          {!categorySlug && !subcategorySlug && (
            <ProjectGrid 
              title="All Work"
              subtitle="Explore our photography and cinematography projects"
            />
          )}

          {/* Projects Grid for subcategory view */}
          {projects.length > 0 && subcategorySlug && (
            <>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {projects.map((project, index) => (
                  <motion.div key={project.id} variants={itemVariants}>
                    <Link to={`/portfolio/project/${project.id}`}>
                      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer group">
                        <div className="aspect-[4/3] overflow-hidden relative">
                          <img
                            src={project.thumbnail_url || project.image_url}
                            alt={project.title}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop';
                            }}
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white bg-opacity-90 rounded-full p-3">
                              <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </div>
                          </div>
                          
                          {/* Video indicator */}
                          {project.videos && project.videos.length > 0 && (
                            <div className="absolute top-3 right-3 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z"/>
                              </svg>
                              {project.videos.length} video{project.videos.length > 1 ? 's' : ''}
                            </div>
                          )}
                        </div>
                        <div className="p-6">
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            {project.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 mb-3">
                            {project.description}
                          </p>
                          <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-500">
                            <span>Views: {project.view_count || 0}</span>
                            {project.tags && project.tags.length > 0 && (
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                {project.tags[0]}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>

              {/* Load More Button */}
              {hasMore && (
                <div className="text-center mt-8">
                  <button
                    onClick={loadMore}
                    disabled={loading}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? 'Loading...' : 'Load More'}
                  </button>
                </div>
              )}
            </>
          )}

          {/* No Projects Message */}
          {!loading && projects.length === 0 && !currentCategory && (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="text-gray-400 dark:text-gray-500 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No Projects Available
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  We're currently updating our portfolio. Check back soon for amazing photography and cinematography work!
                </p>
                <div className="space-y-2 text-sm text-gray-500 dark:text-gray-500">
                  <p>• Wedding Photography</p>
                  <p>• Pre-wedding Sessions</p>
                  <p>• Maternity Photography</p>
                  <p>• Cinematography</p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </Section>
    </div>
  );
};

export default PortfolioNew; 