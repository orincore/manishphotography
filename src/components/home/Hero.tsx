import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useHeroSection } from '../../hooks/useHomepageData';
import { HomepageElement } from '../../services/homepageService';
import { AnimatePresence, motion } from 'framer-motion';

const Hero: React.FC = () => {
  const { elements: heroElements, loading, error } = useHeroSection();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // 1 for next, -1 for prev
  const [videoError, setVideoError] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (heroElements.length <= 1) return;

    const currentElement = heroElements[currentIndex];
    const isVideo = currentElement?.media_type === 'video' || currentElement?.type === 'hero-video';
    const videoUrl = currentElement?.media_type === 'video' ? currentElement.media_url : currentElement?.video_url;

    // If current element is a video, don't auto-advance
    if (isVideo && videoUrl && !videoError) {
      return;
    }

    // For images or when video fails, use the original 5-second interval
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % heroElements.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [heroElements.length, currentIndex, videoError, heroElements]);

  // Reset video error when current element changes
  useEffect(() => {
    setVideoError(false);
    setIsVideoPlaying(false);
  }, [currentIndex, heroElements]);

  // Handle video end event
  const handleVideoEnd = () => {
    setIsVideoPlaying(false);
    if (heroElements.length > 1) {
      setDirection(1);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % heroElements.length);
    }
  };

  // Handle video play event
  const handleVideoPlay = () => {
    setIsVideoPlaying(true);
  };

  // Handle manual skip of video
  const handleSkipVideo = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = videoRef.current.duration; // Jump to end
    }
  };

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? heroElements.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setDirection(1);
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
        <div className="text-center text-white px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Welcome to Manish Photography
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8">
            Capturing Life's Beautiful Moments
          </p>
          <p className="text-base sm:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto">
            Professional photography services for weddings, portraits, and special events
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
            <Link
              to="/portfolio"
              className="bg-white text-gray-900 px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm sm:text-base w-full sm:w-auto text-center"
            >
              View Portfolio
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white text-white px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors text-sm sm:text-base w-full sm:w-auto text-center"
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
  const videoUrl = currentElement.media_type === 'video' ? currentElement.media_url : currentElement.video_url;

  // Animation variants
  const bgVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction > 0 ? '-100%' : '100%',
      opacity: 0
    })
  };

  const textVariants = {
    enter: { opacity: 0, y: 40 },
    center: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -40 }
  };

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background Image/Video with Animation */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentElement.id + (currentElement.media_url || currentElement.image_url || currentElement.video_url || '')}
          className="absolute inset-0 w-full h-full"
          custom={direction}
          variants={bgVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.7, ease: 'easeInOut' }}
          style={{ zIndex: 1 }}
        >
          {(currentElement.media_type === 'video' || currentElement.type === 'hero-video') && videoUrl && !videoError ? (
            <video
              ref={videoRef}
              autoPlay={currentElement.video_autoplay !== false}
              muted={currentElement.video_muted !== false}
              loop={false} // Disable loop so video ends naturally
              playsInline
              preload="auto"
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
                setVideoError(true);
              }}
              onLoadStart={() => {}}
              onCanPlay={() => {}}
              onLoadedData={() => {}}
              onPlay={handleVideoPlay}
              onEnded={handleVideoEnd}
            >
              <source src={videoUrl} type="video/mp4" />
              <source src={videoUrl} type="video/webm" />
              <source src={videoUrl} type="video/ogg" />
              Your browser does not support the video tag.
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
        </motion.div>
      </AnimatePresence>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40 z-10" />

      {/* Content with Animation */}
      <div className="relative z-20 h-full flex items-center justify-center text-center text-white px-4 sm:px-6 lg:px-8">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentElement.id + '-text'}
            variants={textVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="max-w-4xl mx-auto"
          >
            {currentElement.title && (
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 animate-fade-in leading-tight">
                {currentElement.title}
              </h1>
            )}
            {currentElement.subtitle && (
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-6 sm:mb-8 animate-fade-in-delay leading-relaxed">
                {currentElement.subtitle}
              </p>
            )}
            {currentElement.description && (
              <p className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto animate-fade-in-delay-2 leading-relaxed">
                {currentElement.description}
              </p>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center animate-fade-in-delay-3">
              <Link
                to="/portfolio"
                className="bg-white text-gray-900 px-6 sm:px-8 lg:px-10 py-3 sm:py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm sm:text-base lg:text-lg w-full sm:w-auto text-center"
              >
                View Portfolio
              </Link>
              <Link
                to="/contact"
                className="border-2 border-white text-white px-6 sm:px-8 lg:px-10 py-3 sm:py-4 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors text-sm sm:text-base lg:text-lg w-full sm:w-auto text-center"
              >
                Get in Touch
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      {heroElements.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 sm:p-3 rounded-full hover:bg-opacity-75 transition-all z-30"
            aria-label="Previous slide"
          >
            <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 sm:p-3 rounded-full hover:bg-opacity-75 transition-all z-30"
            aria-label="Next slide"
          >
            <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Indicators: Dots + Scroll */}
      {heroElements.length > 1 ? (
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-20">
          <div className="mb-3 flex space-x-2">
            {heroElements.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-white'
                    : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
          
          {/* Video playing indicator */}
          {isVideoPlaying && (
            <div className="mb-2 flex items-center space-x-2 text-white text-xs sm:text-sm px-3 py-1 bg-black bg-opacity-30 rounded-full">
              <div className="flex space-x-1">
                <div className="w-1 h-3 sm:h-4 bg-white animate-pulse"></div>
                <div className="w-1 h-3 sm:h-4 bg-white animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-1 h-3 sm:h-4 bg-white animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <span className="hidden sm:inline">Video playing - will advance when finished</span>
              <span className="sm:hidden">Playing...</span>
              <button
                onClick={handleSkipVideo}
                className="ml-2 px-2 py-1 bg-white bg-opacity-20 rounded text-xs hover:bg-opacity-30 transition-colors"
              >
                Skip
              </button>
            </div>
          )}
          
          <div className="animate-bounce">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      ) : (
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      )}
    </section>
  );
};

export default Hero;