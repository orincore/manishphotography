import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Section from '../components/common/Section';
import CostEstimatorComponent from '../components/estimator/CostEstimator';

const CostEstimator = () => {
  useEffect(() => {
    // Update page title
    document.title = 'Cost Estimator - Manish Photography';
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <Section title="Cost Estimator" subtitle="Get an estimate for your photography needs">
        <div className="max-w-3xl mx-auto mt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <CostEstimatorComponent />
            
            <div className="mt-12 bg-blue-50 dark:bg-blue-900/30 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                How Our Pricing Works
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Our photography and cinematography packages are tailored to your specific needs and location. The estimator above provides a starting point based on:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-4">
                <li>Wedding type (in-city or destination)</li>
                <li>Location and distance</li>
                <li>Expected coverage duration</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300">
                For a complete custom quote that includes additional services such as drone coverage, second photographer, or specialized equipment, please contact us directly.
              </p>
            </div>
          </motion.div>
        </div>
      </Section>
    </div>
  );
};

export default CostEstimator;