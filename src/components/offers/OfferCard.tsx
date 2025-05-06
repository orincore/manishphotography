import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { OfferItem } from '../../types';
import Button from '../common/Button';

interface OfferCardProps {
  offer: OfferItem;
}

const OfferCard: React.FC<OfferCardProps> = ({ offer }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`relative bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden border ${
        offer.popular ? 'border-blue-500' : 'border-transparent'
      }`}
    >
      {offer.popular && (
        <div className="absolute top-0 right-0 bg-blue-600 text-white py-1 px-4 text-sm font-medium">
          Popular
        </div>
      )}
      
      <div className="h-48 overflow-hidden">
        <img
          src={offer.image}
          alt={offer.title}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{offer.title}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">{offer.description}</p>
        
        <div className="mb-6">
          <div className="flex items-baseline mb-2">
            {offer.discountedPrice && (
              <span className="text-3xl font-bold text-gray-900 dark:text-white mr-2">
                ${offer.discountedPrice}
              </span>
            )}
            <span className={`text-xl ${
              offer.discountedPrice ? 'line-through text-gray-500' : 'font-bold text-gray-900 dark:text-white'
            }`}>
              ${offer.price}
            </span>
          </div>
          
          {offer.expiryDate && (
            <p className="text-sm text-red-600">
              Offer valid until {new Date(offer.expiryDate).toLocaleDateString()}
            </p>
          )}
        </div>
        
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">What's included:</h4>
          <ul className="space-y-2">
            {offer.features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <Check size={18} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 dark:text-gray-300">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <Link to="/contact">
          <Button className="w-full">Book This Package</Button>
        </Link>
      </div>
    </motion.div>
  );
};

export default OfferCard;