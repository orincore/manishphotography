import { motion } from 'framer-motion';
import { Star, ThumbsUp } from 'lucide-react';
import { Review } from '../../types';

interface ReviewListProps {
  reviews: Review[];
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
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
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {reviews.map((review) => (
        <motion.div
          key={review.id}
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
        >
          <div className="flex items-start">
            {review.userAvatar && (
              <img
                src={review.userAvatar}
                alt={review.userName}
                className="w-12 h-12 rounded-full object-cover mr-4"
              />
            )}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {review.userName}
                </h4>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <div className="flex items-center mb-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    size={16}
                    className={`${
                      index < review.rating
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                  for {review.serviceType.replace('-', ' ')}
                </span>
              </div>
              
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {review.comment}
              </p>
              
              <button className="flex items-center text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <ThumbsUp size={16} className="mr-1" />
                <span className="text-sm">Helpful</span>
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ReviewList;