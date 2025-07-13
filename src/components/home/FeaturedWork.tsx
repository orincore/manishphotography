import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { videos } from '../../data/videos';
import Section from '../common/Section';
import Button from '../common/Button';
import Lightbox from '../common/Lightbox';
import portfolioService, { PortfolioProject } from '../../services/portfolioService';
import { shuffle } from 'lodash';

const FeaturedWork = () => {
  const [activeTab, setActiveTab] = useState<'photos' | 'videos'>('photos');
  const [featuredProjects, setFeaturedProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<Array<{
    id: string;
    src: string;
    alt: string;
    title?: string;
    description?: string;
  }>>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [randomImages, setRandomImages] = useState<Array<{ src: string; alt: string; title?: string; description?: string; projectId: string }>>([]);
  
  useEffect(() => {
    const fetchFeaturedProjects = async () => {
      try {
        setLoading(true);
        const response = await portfolioService.getPublishedProjects({
          limit: 4,
        });
        setFeaturedProjects(response.projects);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load featured projects');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProjects();
  }, []);
  
  useEffect(() => {
    const fetchRandomImages = async () => {
      try {
        setLoading(true);
        const response = await portfolioService.getPublishedProjects({ limit: 50 });
        // Flatten all images from all projects
        const allImages: Array<{ src: string; alt: string; title?: string; description?: string; projectId: string }> = [];
        response.projects.forEach((project: any) => {
          if (Array.isArray(project.images) && project.images.length > 0) {
            project.images.forEach((img: any) => {
              allImages.push({
                src: img.image_url,
                alt: project.title,
                title: project.title,
                description: project.description,
                projectId: project.id,
              });
            });
          } else if (project.image_url) {
            allImages.push({
              src: project.image_url,
              alt: project.title,
              title: project.title,
              description: project.description,
              projectId: project.id,
            });
          }
        });
        // Shuffle and pick 8 random images
        const shuffled = shuffle(allImages).slice(0, 8);
        setRandomImages(shuffled);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load images');
      } finally {
        setLoading(false);
      }
    };
    if (activeTab === 'photos') fetchRandomImages();
  }, [activeTab]);
  
  const featuredVideos = videos.filter(video => video.featured).slice(0, 3);

  const openLightbox = (projectIndex: number) => {
    if (featuredProjects.length === 0) return;
    
    const images = featuredProjects.map(project => ({
      id: project.id,
      src: project.image_url || project.thumbnail_url || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=600&fit=crop',
      alt: project.title,
      title: project.title,
      description: project.description,
    }));
    
    setLightboxImages(images);
    setLightboxIndex(projectIndex);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
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
        duration: 0.6,
      },
    },
  };

  return (
    <Section 
      title="Featured Work" 
      subtitle="A showcase of our finest photography and cinematography projects"
    >
      <div className="mb-6 sm:mb-8 flex justify-center">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            onClick={() => setActiveTab('photos')}
            className={`px-4 sm:px-6 py-2 text-sm font-medium border rounded-l-lg ${
              activeTab === 'photos'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700'
            }`}
          >
            Photography
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('videos')}
            className={`px-4 sm:px-6 py-2 text-sm font-medium border rounded-r-lg ${
              activeTab === 'videos'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700'
            }`}
          >
            Cinematography
          </button>
        </div>
      </div>

      <div className="mt-6 sm:mt-8">
        {activeTab === 'photos' && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
          >
            {loading ? (
              <div className="col-span-full text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Loading featured work...</p>
              </div>
            ) : error ? (
              <div className="col-span-full text-center py-8">
                <p className="text-red-600 dark:text-red-400">{error}</p>
              </div>
            ) : (
              randomImages.map((img, index) => (
                <motion.div key={img.src + index} variants={itemVariants}>
                  <div
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer group"
                    onClick={() => {
                      setLightboxImages(randomImages.map(i => ({ id: i.projectId, src: i.src, alt: i.alt, title: i.title, description: i.description })));
                      setLightboxIndex(index);
                      setLightboxOpen(true);
                    }}
                  >
                    <div className="aspect-square overflow-hidden relative">
                      <img
                        src={img.src}
                        alt={img.alt}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        onError={e => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop';
                        }}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white bg-opacity-90 rounded-full p-3">
                          <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {img.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {img.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        )}

        {activeTab === 'videos' && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {featuredVideos.map(
              (video) => (
                <motion.div key={video.id} variants={itemVariants}>
                  <Link to={`/portfolio?category=cinematics&id=${video.id}`}>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 relative">
                      <div className="aspect-video overflow-hidden">
                        <video
                          src={video.videoUrl}
                          poster={video.thumbnail}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          muted
                          loop
                          playsInline
                          preload="metadata"
                          controls={false}
                          onMouseOver={e => e.currentTarget.play()}
                          onMouseOut={e => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
                        />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="rounded-full bg-white bg-opacity-80 p-4">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-8 h-8 text-blue-600"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                          {video.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          {video.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            )}
          </motion.div>
        )}
      </div>

      <div className="mt-12 text-center">
        <Link to="/portfolio">
          <Button size="lg">View All Work</Button>
        </Link>
      </div>

      {/* Lightbox */}
      <Lightbox
        isOpen={lightboxOpen}
        onClose={closeLightbox}
        images={lightboxImages}
        initialIndex={lightboxIndex}
      />
    </Section>
  );
};

export default FeaturedWork;