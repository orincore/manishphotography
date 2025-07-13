import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import portfolioService from '../../services/portfolioService';
import { PortfolioProject } from '../../types';

interface ProjectGridProps {
  title?: string;
  subtitle?: string;
}

const ProjectGrid: React.FC<ProjectGridProps> = ({ 
  title = "All Work", 
  subtitle = "Explore our photography and cinematography projects" 
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    hasMore: false
  });
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    subcategory: searchParams.get('subcategory') || '',
    page: parseInt(searchParams.get('page') || '1'),
    limit: parseInt(searchParams.get('limit') || '12')
  });
  // Store aspect ratios for each project by id
  const [aspectRatios, setAspectRatios] = useState<{ [id: string]: number }>({});

  useEffect(() => {
    fetchProjects();
  }, [filters]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: filters.page,
        limit: filters.limit,
      };
      
      if (filters.category) params.category = filters.category;
      if (filters.subcategory) params.subcategory = filters.subcategory;

      const response = await portfolioService.getPublishedProjects(params);
      
      if (filters.page === 1) {
        setProjects(response.projects);
      } else {
        setProjects(prev => [...prev, ...response.projects]);
      }
      
      setPagination(response.pagination);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    setFilters(prev => ({
      ...prev,
      page: prev.page + 1
    }));
  };

  const updateFilters = (newFilters: any) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1 // Reset to first page when filters change
    }));
    setSearchParams(newFilters);
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

  if (loading && filters.page === 1) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading projects...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          {title}
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          {subtitle}
        </p>
      </div>

      {projects.length > 0 ? (
        <>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {projects.map((project, index) => (
              <motion.div key={project.id} variants={itemVariants}>
                <Link to={`/portfolio/project/${project.id}`}>
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer group">
                    <div
                      className="overflow-hidden relative w-full"
                      style={{
                        aspectRatio: aspectRatios[project.id] || 4 / 3,
                        maxHeight: '350px',
                        maxWidth: '100%',
                        background: '#f3f4f6',
                      }}
                    >
                      <img
                        src={project.thumbnail_url || project.image_url}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        onLoad={e => {
                          const img = e.currentTarget;
                          if (img.naturalWidth && img.naturalHeight) {
                            setAspectRatios(prev =>
                              prev[project.id] !== img.naturalWidth / img.naturalHeight
                                ? { ...prev, [project.id]: img.naturalWidth / img.naturalHeight }
                                : prev
                            );
                          }
                        }}
                        onError={e => {
                          const target = e.currentTarget as HTMLImageElement;
                          target.src = 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop';
                        }}
                        style={{ background: '#f3f4f6' }}
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
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {project.portfolio_subcategories?.portfolio_categories?.name || project.category}
                        </span>
                      </div>
                      {project.tags && project.tags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1">
                          {project.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              {tag}
                            </span>
                          ))}
                          {project.tags.length > 2 && (
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              +{project.tags.length - 2}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Load More Button */}
          {pagination.hasMore && (
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
      ) : (
        /* No Projects Message */
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No Projects Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              No projects found matching your criteria.
            </p>
            <button 
              onClick={() => updateFilters({ category: '', subcategory: '' })}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectGrid; 