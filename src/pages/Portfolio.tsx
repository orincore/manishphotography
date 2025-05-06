import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { images } from '../data/images';
import { videos } from '../data/videos';
import Section from '../components/common/Section';
import PortfolioFilter from '../components/portfolio/PortfolioFilter';
import ImageGallery from '../components/portfolio/ImageGallery';
import VideoGallery from '../components/portfolio/VideoGallery';

const Portfolio = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'photos';
  const initialSubcategory = searchParams.get('subcategory') || '';
  
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [activeSubcategory, setActiveSubcategory] = useState(initialSubcategory);
  
  useEffect(() => {
    // Update page title
    document.title = 'Portfolio - Manish Photography';
  }, []);
  
  const filteredImages = images.filter(image => {
    if (activeCategory !== 'photos') return false;
    if (activeSubcategory && image.subcategory !== activeSubcategory) return false;
    return true;
  });
  
  const filteredVideos = videos.filter(video => activeCategory === 'cinematics');

  return (
    <div className="min-h-screen pt-24 pb-16">
      <Section title="Our Portfolio" subtitle="Explore our photography and cinematography work">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <PortfolioFilter 
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            activeSubcategory={activeSubcategory}
            setActiveSubcategory={setActiveSubcategory}
          />
          
          {activeCategory === 'photos' && <ImageGallery images={filteredImages} />}
          {activeCategory === 'cinematics' && <VideoGallery videos={filteredVideos} />}
        </motion.div>
      </Section>
    </div>
  );
};

export default Portfolio;