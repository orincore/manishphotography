import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore';
import { Review } from '../types';
import Section from '../components/common/Section';
import ReviewForm from '../components/reviews/ReviewForm';
import ReviewList from '../components/reviews/ReviewList';
import EditReviewForm from '../components/reviews/EditReviewForm';
import feedbackService from '../services/feedbackService';

const Reviews = () => {
  const { isAuthenticated, user } = useAuthStore();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [duplicateFeedback, setDuplicateFeedback] = useState<any | null>(null);
  const [editingReview, setEditingReview] = useState<Review | null>(null);

  useEffect(() => {
    document.title = 'Reviews - Manish Photography';
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch approved feedback from API (new response structure)
      const response = await feedbackService.getApprovedFeedback();
      const feedbackArr = response.feedback || [];
      const mappedReviews: Review[] = feedbackArr.map((fb: any) => ({
        id: fb.id,
        userId: fb.user_id,
        userName: fb.users?.name || 'Anonymous',
        userAvatar: undefined, // Not provided in API response
        rating: fb.rating,
        comment: fb.comment,
        serviceType: 'wedding', // Not provided, fallback
        createdAt: fb.created_at,
      }));
      setReviews(mappedReviews);
    } catch (err) {
      setError('Failed to load reviews.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (reviewData: {
    rating: number;
    comment: string;
    serviceType: 'wedding' | 'pre-wedding' | 'event' | 'commercial';
  }) => {
    if (!user) return;
    setError(null);
    setDuplicateFeedback(null);
    try {
      // Submit feedback to API
      await feedbackService.submitFeedback({
        rating: reviewData.rating,
        comment: reviewData.comment,
      });
      // Refresh reviews after submission
      fetchReviews();
    } catch (err: any) {
      // Check for duplicate feedback error
      if (err?.response?.data?.error?.code === 'FEEDBACK_EXISTS') {
        setDuplicateFeedback(err.response.data.error);
        setError(null);
      } else {
        // Display exact error message from API
        const errorMessage = err?.response?.data?.error?.message || 
                           err?.response?.data?.message || 
                           err?.response?.data?.error || 
                           err?.message || 
                           'Failed to submit review.';
        setError(errorMessage);
      }
    }
  };

  const handleEditReview = (review: Review) => {
    setEditingReview(review);
  };

  const handleUpdateReview = async (reviewId: string, data: { rating: number; comment: string }) => {
    try {
      await feedbackService.updateOwnFeedback(reviewId, data);
      setEditingReview(null);
      fetchReviews();
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to update review.';
      setError(errorMessage);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete your review? This action cannot be undone.')) {
      return;
    }
    
    try {
      await feedbackService.deleteOwnFeedback(reviewId);
      fetchReviews();
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to delete review.';
      setError(errorMessage);
    }
  };

  const handleDeleteFeedback = async () => {
    if (!duplicateFeedback?.existingFeedback?.id) return;
    try {
      await feedbackService.deleteOwnFeedback(duplicateFeedback.existingFeedback.id);
      setDuplicateFeedback(null);
      fetchReviews();
    } catch {
      setError('Failed to delete your existing feedback.');
    }
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
            {error && <p className="text-red-500 mt-4">{error}</p>}
            {duplicateFeedback && (
              <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mt-4 rounded">
                <div className="font-semibold mb-2">You have already submitted feedback.</div>
                <div className="mb-2">You can edit or delete your existing feedback below:</div>
                <div className="mb-2">
                  <span className="font-medium">Rating:</span> {duplicateFeedback.existingFeedback.rating} <br />
                  <span className="font-medium">Comment:</span> {duplicateFeedback.existingFeedback.comment}
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    onClick={() => handleEditReview(duplicateFeedback.existingFeedback)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    onClick={handleDeleteFeedback}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </motion.div>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <ReviewList 
              reviews={reviews} 
              onEdit={handleEditReview}
              onDelete={handleDeleteReview}
            />
          )}
        </div>
      </Section>
      
      {/* Edit Review Modal */}
      <AnimatePresence>
        {editingReview && (
          <EditReviewForm
            review={editingReview}
            onSubmit={handleUpdateReview}
            onCancel={() => setEditingReview(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Reviews;