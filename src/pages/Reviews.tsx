import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore';
import { reviews as initialReviews } from '../data/reviews';
import { Review } from '../types';
import Section from '../components/common/Section';
import ReviewForm from '../components/reviews/ReviewForm';
import ReviewList from '../components/reviews/ReviewList';

const Reviews = () => {
  const { isAuthenticated, user } = useAuthStore();
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  
  useEffect(() => {
    // Update page title
    document.title = 'Reviews - Manish Photography';
  }, []);

  const handleSubmitReview = (reviewData: {
    rating: number;
    comment: string;
    serviceType: 'wedding' | 'pre-wedding' | 'event' | 'commercial';
  }) => {
    if (!user) return;
    
    const newReview: Review = {
      id: (reviews.length + 1).toString(),
      userId: user.id,
      userName: `${user.firstName} ${user.lastName}`,
      rating: reviewData.rating,
      comment: reviewData.comment,
      serviceType: reviewData.serviceType,
      createdAt: new Date().toISOString(),
    };
    
    setReviews([newReview, ...reviews]);
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <Section title="Reviews" subtitle="Share your experience with our services">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <ReviewForm onSubmit={handleSubmitReview} />
          </motion.div>
          
          <ReviewList reviews={reviews} />
        </div>
      </Section>
    </div>
  );
};

export default Reviews;