import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../common/Button';

const CallToAction = () => {
  return (
    <div className="bg-blue-700 text-white py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6"
          >
            Ready to Capture Your Special Moments?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg lg:text-xl text-blue-100 mb-6 sm:mb-8 md:mb-10 leading-relaxed"
          >
            Book your photography or cinematography session today and let us tell your unique story through our lenses.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex justify-center"
          >
            <Link to="/contact" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto bg-blue text-blue-700 hover:bg-blue-50 text-sm sm:text-base">
                Contact Us
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CallToAction;