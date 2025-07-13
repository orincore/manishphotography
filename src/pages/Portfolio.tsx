import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Section from '../components/common/Section';
// import portfolioService from '../services/portfolioService';
// import { PortfolioCategory, PortfolioProject } from '../types';

const Portfolio = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [categoryMedia, setCategoryMedia] = useState<Record<string, { type: 'image' | 'video', src: string, poster?: string }>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const shuffleIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    document.title = 'Portfolio - Manish Photography';
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('https://api.manishbosephotography.com/api/portfolio/categories');
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        if (data && Array.isArray(data.projects)) {
          // Group projects by category
          const categoryMap: Record<string, any[]> = {};
          data.projects.forEach((project: any) => {
            if (!categoryMap[project.category]) {
              categoryMap[project.category] = [];
            }
            categoryMap[project.category].push(project);
          });
          // Create a list of categories with their first project as a representative
          const categoriesList = Object.keys(categoryMap).map((catSlug) => {
            const projects = categoryMap[catSlug];
            const firstProject = projects[0];
            return {
              slug: catSlug,
              name: firstProject.category.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()),
              description: firstProject.description || '',
              projects,
            };
          });
          setCategories(categoriesList);

          // Set up preview for each category: prefer image_url, else video_url, else fallback
          const mediaMap: Record<string, { type: 'image' | 'video', src: string }> = {};
          categoriesList.forEach((cat) => {
            // Find the first project with an image_url
            const imageProject = cat.projects.find((p: any) => p.image_url);
            if (imageProject && imageProject.image_url) {
              mediaMap[cat.slug] = { type: 'image', src: imageProject.image_url };
            } else {
              // If no image, find the first project with a video_url (either direct or in videos array)
              let videoUrl = null;
              let found = false;
              for (const p of cat.projects) {
                if (p.video_url) {
                  videoUrl = p.video_url;
                  found = true;
                  break;
                }
                if (Array.isArray(p.videos) && p.videos.length > 0 && p.videos[0].video_url) {
                  videoUrl = p.videos[0].video_url;
                  found = true;
                  break;
                }
              }
              if (found && videoUrl) {
                mediaMap[cat.slug] = { type: 'video', src: videoUrl };
              } else {
                mediaMap[cat.slug] = { type: 'image', src: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=600&fit=crop' };
              }
            }
          });
          setCategoryMedia(mediaMap);
        } else {
          setCategories([]);
          setCategoryMedia({});
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load portfolio categories');
        setCategories([]);
        setCategoryMedia({});
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Shuffle images every 5 seconds for image categories
  useEffect(() => {
    if (categories.length === 0) return;
    if (shuffleIntervalRef.current) window.clearInterval(shuffleIntervalRef.current);
    shuffleIntervalRef.current = window.setInterval(() => {
      setCategoryMedia((prev) => {
        const newMedia: Record<string, { type: 'image' | 'video', src: string }> = { ...prev };
        categories.forEach((cat) => {
          // Only shuffle if not a video category
          const imageProjects = cat.projects.filter((p: any) => p.image_url);
          if (imageProjects.length > 0) {
            let newIdx = Math.floor(Math.random() * imageProjects.length);
            // Avoid showing the same image as before
            if (imageProjects.length > 1 && imageProjects[newIdx].image_url === prev[cat.slug]?.src) {
              newIdx = (newIdx + 1) % imageProjects.length;
            }
            newMedia[cat.slug] = { type: 'image', src: imageProjects[newIdx].image_url };
          }
        });
        return newMedia;
      });
    }, 5000);
    return () => {
      if (shuffleIntervalRef.current) window.clearInterval(shuffleIntervalRef.current);
    };
  }, [categories]);

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

  if (loading) {
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

  if (error) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <Section title="Our Portfolio" subtitle="Explore our photography and cinematography work">
          <div className="text-center py-8">
            <p className="text-red-600 dark:text-red-400">{error}</p>
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
          {categories.length === 0 ? (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="text-gray-400 dark:text-gray-500 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No Portfolio Categories Available
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  We're currently setting up our portfolio categories. Check back soon!
                </p>
              </div>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {categories.map((category) => {
                const media = categoryMedia[category.slug];
                return (
                  <motion.div key={category.slug} variants={itemVariants}>
                    <Link to={`/portfolio/${category.slug}`}>
                      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-shadow duration-300 group hover:shadow-2xl hover:scale-[1.03] hover:z-10 relative">
                        <div className="aspect-[4/3] md:aspect-[4/3] aspect-auto overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                          {media && media.type === 'video' ? (
                            <video
                              src={media.src}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 max-h-80 max-w-full rounded"
                              style={{ aspectRatio: '4/3', objectFit: 'cover', background: '#f3f4f6' }}
                              muted
                              loop
                              playsInline
                              preload="metadata"
                              onMouseOver={e => (e.currentTarget as HTMLVideoElement).play()}
                              onMouseOut={e => (e.currentTarget as HTMLVideoElement).pause()}
                            />
                          ) : (
                            <img
                              src={media?.src}
                              alt={category.name}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 max-h-80 max-w-full rounded"
                              style={{ aspectRatio: '4/3', objectFit: 'cover', background: '#f3f4f6' }}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=600&fit=crop';
                              }}
                            />
                          )}
                        </div>
                        <div className="p-6">
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            {category.name}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 mb-4">
                            {category.description}
                          </p>
                          <div className="mb-4">
                            <div className="flex flex-wrap gap-2 mb-3">
                              {category.projects.slice(0, 3).map((proj: any) => (
                                <span key={proj.id} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                  {proj.title}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </motion.div>
      </Section>
    </div>
  );
};

export default Portfolio;