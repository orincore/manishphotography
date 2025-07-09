import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import Button from '../common/Button';

interface ReviewFormProps {
  onSubmit: (review: {
    rating: number;
    comment: string;
    serviceType: 'wedding' | 'pre-wedding' | 'event' | 'commercial';
  }) => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [serviceType, setServiceType] = useState<'wedding' | 'pre-wedding' | 'event' | 'commercial'>('wedding');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }
    
    if (!comment.trim()) {
      setError('Please enter a comment');
      return;
    }
    
    onSubmit({ rating, comment, serviceType });
    setRating(0);
    setComment('');
    setError('');
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
    >
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Write a Review
      </h3>
      
      {error && (
        <p className="text-red-500 mb-4">{error}</p>
      )}
      
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 text-center">
          Rate your experience
        </label>
        <div className="flex justify-center space-x-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="focus:outline-none transform hover:scale-110 transition-transform duration-200"
            >
              <Star
                size={40}
                className={`${
                  star <= (hoverRating || rating)
                    ? 'text-yellow-500 fill-yellow-500 drop-shadow-sm'
                    : 'text-gray-300 dark:text-gray-600 hover:text-yellow-300'
                } transition-all duration-200`}
              />
            </button>
          ))}
        </div>
        {rating > 0 && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 text-center">
            You rated: {rating} star{rating > 1 ? 's' : ''}
          </p>
        )}
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Your Review
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Share your experience..."
        ></textarea>
      </div>
      
      <Button type="submit" className="w-full">
        Submit Review
      </Button>
    </motion.form>
  );
};

export default ReviewForm;