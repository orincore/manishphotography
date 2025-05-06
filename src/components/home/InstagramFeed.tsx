import { motion } from 'framer-motion';
import { Instagram } from 'lucide-react';
import Section from '../common/Section';

const InstagramFeed = () => {
  // Mock Instagram images
  const instagramImages = [
    'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg',
    'https://images.pexels.com/photos/1231365/pexels-photo-1231365.jpeg',
    'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg',
    'https://images.pexels.com/photos/1619317/pexels-photo-1619317.jpeg',
    'https://images.pexels.com/photos/1721558/pexels-photo-1721558.jpeg',
    'https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg',
  ];

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
    <Section title="Instagram" subtitle="Follow us @manishphotography for more stunning visuals">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
      >
        {instagramImages.map((image, index) => (
          <motion.div 
            key={index} 
            variants={itemVariants}
            className="relative overflow-hidden aspect-square group"
          >
            <img
              src={image}
              alt={`Instagram feed ${index + 1}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300 flex items-center justify-center">
              <Instagram 
                size={32} 
                className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
              />
            </div>
          </motion.div>
        ))}
      </motion.div>
      
      <div className="mt-8 text-center">
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
        >
          <Instagram size={20} />
          <span>Follow on Instagram</span>
        </a>
      </div>
    </Section>
  );
};

export default InstagramFeed;