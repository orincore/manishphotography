import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Eye, Calendar, Tag, MapPin } from 'lucide-react';
import Section from '../components/common/Section';
import PortfolioMediaGallery from '../components/portfolio/PortfolioMediaGallery';
import portfolioService from '../services/portfolioService';
import { PortfolioProject } from '../types';

const PortfolioProjectDetail: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<PortfolioProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);

  useEffect(() => {
    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const projectData = await portfolioService.getProject(projectId!);
      setProject(projectData);
      
      // Update page title
      document.title = `${projectData.title} - Manish Photography`;
    } catch (err: any) {
      console.error('Error fetching project:', err);
      setError(err.response?.data?.message || 'Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  const handleMediaChange = (mediaIndex: number) => {
    setActiveMediaIndex(mediaIndex);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <Section title="Loading Project" subtitle="Please wait...">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </Section>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <Section title="Project Not Found" subtitle="The requested project could not be loaded">
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="text-gray-400 dark:text-gray-500 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Project Not Available
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {error || 'The project you are looking for does not exist or has been removed.'}
              </p>
              <Link
                to="/portfolio"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
                Back to Portfolio
              </Link>
            </div>
          </div>
        </Section>
      </div>
    );
  }

  const combinedMedia = portfolioService.combineMedia(project);
  const hasVideos = portfolioService.hasVideos(project);
  const hasImages = portfolioService.hasImages(project);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <Section title={project.title} subtitle={project.description}>
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb Navigation */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link to="/portfolio" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Portfolio
                </Link>
              </li>
              {project.portfolio_subcategories && (
                <>
                  <li>/</li>
                  <li>
                    <Link 
                      to={`/portfolio/${project.portfolio_subcategories.portfolio_categories.slug}`}
                      className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {project.portfolio_subcategories.portfolio_categories.name}
                    </Link>
                  </li>
                  <li>/</li>
                  <li>
                    <Link 
                      to={`/portfolio/${project.portfolio_subcategories.portfolio_categories.slug}/${project.portfolio_subcategories.slug}`}
                      className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {project.portfolio_subcategories.name}
                    </Link>
                  </li>
                </>
              )}
              <li>/</li>
              <li className="text-gray-900 dark:text-white font-medium">{project.title}</li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Media Gallery */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
              >
                <PortfolioMediaGallery 
                  project={project} 
                  onMediaChange={handleMediaChange}
                />
              </motion.div>

              {/* Project Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8"
              >
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  About This Project
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {project.description}
                </p>
              </motion.div>

              {/* Media Information section removed for public view */}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="space-y-6"
              >
                {/* Project Info Card */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Project Information
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Eye className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Views</div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {project.view_count.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Created</div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {new Date(project.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    {project.portfolio_subcategories && (
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Client</div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {project.portfolio_subcategories.client_name}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <Tag className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Category</div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {project.category}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                {project.tags && project.tags.length > 0 && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-3 py-1 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Navigation
                  </h3>
                  
                  <div className="space-y-3">
                    <Link
                      to="/portfolio"
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                    >
                      <ArrowLeft size={16} />
                      Back to Portfolio
                    </Link>
                    
                    {project.portfolio_subcategories && (
                      <Link
                        to={`/portfolio/${project.portfolio_subcategories.portfolio_categories.slug}/${project.portfolio_subcategories.slug}`}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                      >
                        <ArrowLeft size={16} />
                        Back to {project.portfolio_subcategories.name}
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default PortfolioProjectDetail; 