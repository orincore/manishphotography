import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator } from 'lucide-react';
import Button from '../common/Button';
import { CostEstimate } from '../../types';

const CostEstimator = () => {
  const [estimate, setEstimate] = useState<CostEstimate>({
    weddingType: 'in-city',
    location: '',
    distance: 0,
    estimatedCost: 0,
  });
  
  const [isCalculated, setIsCalculated] = useState(false);
  const [errors, setErrors] = useState<{ location?: string }>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEstimate((prev) => ({ ...prev, [name]: value }));
    
    if (errors.location && name === 'location') {
      setErrors({});
    }
    
    setIsCalculated(false);
  };

  const calculateEstimate = () => {
    if (!estimate.location.trim()) {
      setErrors({ location: 'Please enter a location' });
      return;
    }

    // Mock distance calculation based on location name length
    // In a real application, this would use a geocoding API
    const mockDistance = estimate.location.length * 5;
    
    // Base price 
    let baseCost = estimate.weddingType === 'in-city' ? 2500 : 4500;
    
    // Add distance cost for destination weddings
    let distanceCost = 0;
    if (estimate.weddingType === 'destination') {
      distanceCost = mockDistance * 10; // $10 per mile
    }
    
    const totalCost = baseCost + distanceCost;
    
    setEstimate((prev) => ({
      ...prev,
      distance: mockDistance,
      estimatedCost: totalCost,
    }));
    
    setIsCalculated(true);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Wedding Photography Cost Estimator
      </h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Wedding Type
        </label>
        <select
          name="weddingType"
          value={estimate.weddingType}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="in-city">In-city Wedding</option>
          <option value="destination">Destination Wedding</option>
        </select>
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Location
        </label>
        <input
          type="text"
          name="location"
          value={estimate.location}
          onChange={handleInputChange}
          placeholder={
            estimate.weddingType === 'in-city' 
              ? 'Enter city (e.g. New York)' 
              : 'Enter destination (e.g. Bali, Indonesia)'
          }
          className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
            errors.location ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.location && (
          <p className="mt-1 text-sm text-red-500">{errors.location}</p>
        )}
      </div>
      
      <Button
        onClick={calculateEstimate}
        className="w-full mb-8"
        icon={<Calculator size={18} />}
      >
        Calculate Estimate
      </Button>
      
      {isCalculated && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
          className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/30 rounded-lg"
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Your Estimate
          </h3>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Wedding Type:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {estimate.weddingType === 'in-city' ? 'In-city Wedding' : 'Destination Wedding'}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Location:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {estimate.location}
              </span>
            </div>
            
            {estimate.weddingType === 'destination' && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Estimated Distance:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {estimate.distance} miles
                </span>
              </div>
            )}
            
            <div className="pt-3 border-t border-blue-200 dark:border-blue-700">
              <div className="flex justify-between items-center">
                <span className="text-lg text-gray-700 dark:text-gray-200">
                  Estimated Cost:
                </span>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  ${estimate.estimatedCost.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
          
          <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
            This is a preliminary estimate. Final pricing may vary based on specific requirements,
            date availability, and additional services. Please contact us for a detailed quote.
          </p>
          
          <div className="mt-6">
            <Button 
              variant="primary" 
              className="w-full"
              onClick={() => window.location.href = '/contact'}
            >
              Request Detailed Quote
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default CostEstimator;