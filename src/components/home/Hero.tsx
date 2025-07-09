import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import homepageService, { HomepageElement } from '../../services/homepageService';

const Hero: React.FC = () => {
  const [heroElements, setHeroElements] = useState<HomepageElement[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHeroElements = async () => {
      try {
        setLoading(true);
        const elements = await homepageService.getActiveHeroElements();
        setHeroElements(elements);
        setError(null);
      } catch (err) {
        console.error('Error fetching hero elements:', err);
        setError('Failed to load hero content');
      } finally {
        setLoading(false);
      }
    };

    fetchHeroElements();
  }, []);

  useEffect(() => {
    if (heroElements.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % heroElements.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [heroElements.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? heroElements.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % heroElements.length);
  };

  if (loading) {
    return (
      <section className="relative h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </section>
    );
  }

  if (error || heroElements.length === 0) {
    return (
      <section className="relative h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Welcome to Manish Photography
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            Capturing Life's Beautiful Moments
          </p>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Professional photography services for weddings, portraits, and special events
          </p>
          <div className="space-x-4">
            <Link
              to="/portfolio"
              className="bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              View Portfolio
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const currentElement = heroElements[currentIndex];
  const imageUrl = currentElement.media_url || currentElement.image_url;

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background Image/Video */}
      {(currentElement.media_type === 'video' || currentElement.type === 'hero-video') && currentElement.video_url ? (
        <video
          autoPlay
          muted
          loop
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={currentElement.video_url} type="video/mp4" />
        </video>
      ) : imageUrl ? (
        <img
          src={imageUrl}
          alt={currentElement.title || 'Hero Image'}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gray-900" />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40" />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center text-center text-white px-4">
        <div className="max-w-4xl">
          {currentElement.title && (
            <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">
              {currentElement.title}
            </h1>
          )}
          {currentElement.subtitle && (
            <p className="text-xl md:text-2xl mb-8 animate-fade-in-delay">
              {currentElement.subtitle}
            </p>
          )}
          {currentElement.description && (
            <p className="text-lg mb-8 max-w-2xl mx-auto animate-fade-in-delay-2">
              {currentElement.description}
            </p>
          )}
          <div className="space-x-4 animate-fade-in-delay-3">
            <Link
              to="/portfolio"
              className="bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              View Portfolio
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {heroElements.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all z-20"
            aria-label="Previous slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all z-20"
            aria-label="Next slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {heroElements.length > 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {heroElements.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-white'
                  : 'bg-white bg-opacity-50 hover:bg-opacity-75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Scroll Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 animate-bounce z-20">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
};

export default Hero;