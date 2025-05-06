import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { offers } from '../data/offers';
import Section from '../components/common/Section';
import OfferCard from '../components/offers/OfferCard';

const Offers = () => {
  useEffect(() => {
    // Update page title
    document.title = 'Special Offers - Manish Photography';
  }, []);

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

  return (
    <div className="min-h-screen pt-24 pb-16">
      <Section 
        title="Special Offers" 
        subtitle="Take advantage of our limited-time photography and cinematography packages"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12"
        >
          {offers.map((offer) => (
            <motion.div key={offer.id} variants={itemVariants}>
              <OfferCard offer={offer} />
            </motion.div>
          ))}
        </motion.div>
        
        <div className="mt-16 bg-gray-100 dark:bg-gray-800 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Looking for Something Specific?
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            We offer custom packages tailored to your unique needs. Contact us to discuss your vision and we'll create a personalized quote for you.
          </p>
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="/contact"
            className="inline-block bg-blue-600 text-white font-medium px-8 py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            Request Custom Package
          </motion.a>
        </div>
      </Section>
    </div>
  );
};

export default Offers;