import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, X } from 'lucide-react';
import Button from '../common/Button';
import { Review } from '../../types';

interface EditReviewFormProps {
  review: Review;
  onSubmit: (reviewId: string, data: {
    rating: number;
    comment: string;
  }) => void;
  onCancel: () => void;
}

const EditReviewForm: React.FC<EditReviewFormProps> = ({ review, onSubmit, onCancel }) => {
  const [rating, setRating] = useState(review.rating);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState(review.comment);
  const [error, setError] = useState('');

  useEffect(() => {
    setRating(review.rating);
    setComment(review.comment);
  }, [review]);

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
    
    onSubmit(review.id, { rating, comment });
    setError('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Edit Review
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={24} />
          </button>
        </div>
        
        {error && (
          <p className="text-red-500 mb-4">{error}</p>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
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
          
          <div className="flex space-x-3">
            <Button type="button" onClick={onCancel} variant="secondary" className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Update Review
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default EditReviewForm; 