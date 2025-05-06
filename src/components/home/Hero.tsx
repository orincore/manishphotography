import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';

const heroImages = [
  {
    url: 'https://images.pexels.com/photos/1231365/pexels-photo-1231365.jpeg',
    title: 'Wedding Photography',
    subtitle: 'Capturing timeless moments on your special day',
  },
  {
    url: 'https://images.pexels.com/photos/2788488/pexels-photo-2788488.jpeg',
    title: 'Cinematic Films',
    subtitle: 'Telling your story through beautiful cinematography',
  },
  {
    url: 'https://images.pexels.com/photos/3014856/pexels-photo-3014856.jpeg',
    title: 'Pre-Wedding Shoots',
    subtitle: 'Creating magical memories before your big day',
  },
];

const Hero = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentImageIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          style={{
            backgroundImage: `url(${heroImages[currentImageIndex].url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          className="absolute inset-0"
        />
      </AnimatePresence>

      <div className="absolute inset-0 bg-black bg-opacity-40" />

      <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <AnimatePresence mode="wait">
            <motion.h1
              key={`title-${currentImageIndex}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl font-bold mb-4"
            >
              {heroImages[currentImageIndex].title}
            </motion.h1>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.p
              key={`subtitle-${currentImageIndex}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl mb-8"
            >
              {heroImages[currentImageIndex].subtitle}
            </motion.p>
          </AnimatePresence>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/portfolio">
              <Button 
                size="lg" 
                variant="primary"
                icon={<ArrowRight size={18} />} 
                iconPosition="right"
              >
                View Portfolio
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:bg-opacity-10">
                Get in Touch
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-2">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentImageIndex ? 'bg-blue-600' : 'bg-white bg-opacity-50'
            } transition-colors`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;