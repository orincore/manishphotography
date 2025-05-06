import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../common/Button';

const CallToAction = () => {
  return (
    <div className="bg-blue-700 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Ready to Capture Your Special Moments?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-blue-100 mb-8 md:mb-10"
          >
            Book your photography or cinematography session today and let us tell your unique story through our lenses.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4"
          >
            <Link to="/contact">
              <Button size="lg" className="w-full sm:w-auto bg-blue text-blue-700 hover:bg-blue-50">
                Contact Us
              </Button>
            </Link>
            <Link to="/cost-estimator">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-blue-800">
                Get an Estimate
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CallToAction;