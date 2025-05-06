import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { testimonials } from '../../data/testimonials';
import Section from '../common/Section';

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const featuredTestimonials = testimonials.filter(testimonial => testimonial.featured);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % featuredTestimonials.length);
    }, 8000);
    
    return () => clearInterval(interval);
  }, [featuredTestimonials.length]);

  const handlePrevious = () => {
    setActiveIndex(
      (prevIndex) => (prevIndex - 1 + featuredTestimonials.length) % featuredTestimonials.length
    );
  };

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % featuredTestimonials.length);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        size={20}
        className={index < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
      />
    ));
  };

  return (
    <Section title="Client Testimonials" subtitle="What our clients are saying about us" darkBg>
      <div className="relative max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-800 rounded-lg p-8 md:p-12 shadow-xl"
          >
            <div className="flex flex-col items-center text-center">
              <div className="flex mb-4">{renderStars(featuredTestimonials[activeIndex].rating)}</div>
              <div className="mb-8">
                <blockquote className="text-xl md:text-2xl italic text-gray-200 mb-6">
                  "{featuredTestimonials[activeIndex].text}"
                </blockquote>
                <div className="flex flex-col items-center">
                  {featuredTestimonials[activeIndex].avatar && (
                    <div className="w-16 h-16 rounded-full overflow-hidden mb-3 border-2 border-blue-500">
                      <img
                        src={featuredTestimonials[activeIndex].avatar}
                        alt={featuredTestimonials[activeIndex].name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <cite className="font-semibold text-white text-lg not-italic">
                    {featuredTestimonials[activeIndex].name}
                  </cite>
                  {featuredTestimonials[activeIndex].location && (
                    <span className="text-gray-400 text-sm mt-1">
                      {featuredTestimonials[activeIndex].location}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-center mt-8 space-x-2">
          {featuredTestimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === activeIndex ? 'bg-blue-600' : 'bg-gray-600'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={handlePrevious}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 md:-translate-x-6 bg-white dark:bg-gray-700 rounded-full p-2 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          aria-label="Previous testimonial"
        >
          <ChevronLeft size={24} className="text-gray-900 dark:text-white" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 md:translate-x-6 bg-white dark:bg-gray-700 rounded-full p-2 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          aria-label="Next testimonial"
        >
          <ChevronRight size={24} className="text-gray-900 dark:text-white" />
        </button>
      </div>
    </Section>
  );
};

export default Testimonials;