import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Section from '../components/common/Section';
import portfolioService, { PortfolioCategory, PortfolioProject, fetchCategoryBySnug } from '../services/portfolioService';

const Portfolio = () => {
  const [categories, setCategories] = useState<PortfolioCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryThumbnails, setCategoryThumbnails] = useState<Record<string, string>>({});
  const [categoryProjectImages, setCategoryProjectImages] = useState<Record<string, string[]>>({});
  const shuffleIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    // Update page title
    document.title = 'Portfolio - Manish Photography';
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await portfolioService.getCategories();
        setCategories(response.categories);
        // For each category, fetch its projects and store all image_urls
        const thumbMap: Record<string, string> = {};
        const projectImagesMap: Record<string, string[]> = {};
        await Promise.all(
          response.categories.map(async (cat: PortfolioCategory) => {
            try {
              const res = await fetchCategoryBySnug(cat.slug);
              let projects: PortfolioProject[] = [];
              if ('projects' in res && Array.isArray(res.projects)) {
                projects = res.projects;
              }
              if (projects.length > 0) {
                const images = projects.map(p => p.image_url).filter(Boolean);
                projectImagesMap[cat.id] = images;
                const randomIdx = Math.floor(Math.random() * images.length);
                thumbMap[cat.id] = images[randomIdx] || '';
              }
            } catch {}
          })
        );
        setCategoryThumbnails(thumbMap);
        setCategoryProjectImages(projectImagesMap);
      } catch (err: any) {
        console.error('Error fetching categories:', err);
        setError(err.response?.data?.message || 'Failed to load portfolio categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Shuffle thumbnails every 5 seconds
  useEffect(() => {
    if (Object.keys(categoryProjectImages).length === 0) return;
    if (shuffleIntervalRef.current) window.clearInterval(shuffleIntervalRef.current);
    shuffleIntervalRef.current = window.setInterval(() => {
      setCategoryThumbnails(prev => {
        const newThumbs: Record<string, string> = { ...prev };
        Object.entries(categoryProjectImages).forEach(([catId, images]) => {
          if (images.length > 0) {
            let newIdx = Math.floor(Math.random() * images.length);
            // Avoid showing the same image as before
            if (images.length > 1 && images[newIdx] === prev[catId]) {
              newIdx = (newIdx + 1) % images.length;
            }
            newThumbs[catId] = images[newIdx];
          }
        });
        return newThumbs;
      });
    }, 5000);
    return () => {
      if (shuffleIntervalRef.current) window.clearInterval(shuffleIntervalRef.current);
    };
  }, [categoryProjectImages]);

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

  // Filter categories to only those with at least one image
  const categoriesWithImages = categories.filter(cat =>
    categoryProjectImages[cat.id] && categoryProjectImages[cat.id].length > 0
  );

  return (
    <div className="min-h-screen pt-24 pb-16">
      <Section title="Our Portfolio" subtitle="Explore our photography and cinematography work">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {categoriesWithImages.length === 0 ? (
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
              {categoriesWithImages.map((category) => (
                <motion.div key={category.id} variants={itemVariants}>
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-shadow duration-300 group hover:shadow-2xl hover:scale-[1.03] hover:z-10 relative">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={categoryThumbnails[category.id] || category.thumbnail_url || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=600&fit=crop'}
                        alt={category.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=600&fit=crop';
                        }}
                        style={{ willChange: 'transform' }}
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {category.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {category.description}
                      </p>
                      {/* Subcategories Preview */}
                      {category.portfolio_subcategories.length > 0 && (
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-2 mb-3">
                            {category.portfolio_subcategories.slice(0, 3).map((sub) => (
                              <span key={sub.id} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                {sub.name}
                              </span>
                            ))}
                            {category.portfolio_subcategories.length > 3 && (
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                +{category.portfolio_subcategories.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                      <Link 
                        to={`/portfolio/${category.slug}`}
                        className="inline-block w-full text-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        View Category
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </Section>
    </div>
  );
};

export default Portfolio;