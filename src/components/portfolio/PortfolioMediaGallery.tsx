import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, SkipForward, SkipBack, Maximize2, Minimize2, RotateCcw, Eye } from 'lucide-react';
import { PortfolioProject, PortfolioImage, PortfolioVideo } from '../../types';
import portfolioService from '../../services/portfolioService';

interface PortfolioMediaGalleryProps {
  project: PortfolioProject;
  onMediaChange?: (mediaIndex: number) => void;
}

interface CombinedMedia {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnail: string;
  title?: string;
  description?: string;
  // Video specific properties
  video_autoplay?: boolean;
  video_muted?: boolean;
  video_loop?: boolean;
  video_poster?: string | null;
  video_duration?: number;
  order_index?: number;
  isPortrait?: boolean; // Added for image portrait detection
  aspectRatio?: number; // Added for dynamic aspect ratio
}

const PortfolioMediaGallery: React.FC<PortfolioMediaGalleryProps> = ({ 
  project, 
  onMediaChange 
}) => {
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [controlsTimeout, setControlsTimeout] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [combinedMedia, setCombinedMedia] = useState<CombinedMedia[]>([]);
  // Mobile/CSS fullscreen fallback
  const [cssFullscreen, setCssFullscreen] = useState(false);

  useEffect(() => {
    // Combine images and videos for display
    const images = (project.images || []).map(img => ({
      id: img.id,
      type: 'image' as const,
      url: img.image_url,
      thumbnail: img.thumbnail_url,
      title: project.title,
      description: project.description,
      isPortrait: false, // Initialize as false
      aspectRatio: 1 // Initialize aspect ratio
    }));

    const videos = (project.videos || []).map(vid => ({
      id: vid.id,
      type: 'video' as const,
      url: vid.video_url,
      thumbnail: vid.video_thumbnail_url,
      title: project.title,
      description: project.description,
      video_autoplay: vid.video_autoplay,
      video_muted: vid.video_muted,
      video_loop: vid.video_loop,
      video_poster: vid.video_poster,
      video_duration: vid.video_duration,
      order_index: vid.order_index
    }));

    const combined = [...images, ...videos].sort((a, b) => {
      if (a.type === 'image' && b.type === 'video') return -1;
      if (a.type === 'video' && b.type === 'image') return 1;
      return (a.type === 'video' ? a.order_index || 0 : 0) - (b.type === 'video' ? b.order_index || 0 : 0);
    });

    setCombinedMedia(combined);
  }, [project]);

  useEffect(() => {
    onMediaChange?.(activeMediaIndex);
  }, [activeMediaIndex, onMediaChange]);

  // Auto-hide controls for videos
  useEffect(() => {
    if (isPlaying && showControls) {
      const timeout = setTimeout(() => setShowControls(false), 3000);
      setControlsTimeout(timeout);
      return () => {
        if (timeout) clearTimeout(timeout);
      };
    }
  }, [isPlaying, showControls]);

  const handleMediaChange = (index: number) => {
    setActiveMediaIndex(index);
    setIsPlaying(false);
    setCurrentTime(0);
    setShowControls(true);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const handlePrevious = () => {
    const newIndex = activeMediaIndex > 0 ? activeMediaIndex - 1 : combinedMedia.length - 1;
    handleMediaChange(newIndex);
  };

  const handleNext = () => {
    const newIndex = activeMediaIndex < combinedMedia.length - 1 ? activeMediaIndex + 1 : 0;
    handleMediaChange(newIndex);
  };

  const handleVideoPlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    // Auto-advance to next media if not the last
    if (activeMediaIndex < combinedMedia.length - 1) {
      setTimeout(handleNext, 1000);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      videoRef.current.muted = newVolume === 0;
    }
  };

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    if (videoRef.current) {
      videoRef.current.muted = newMuted;
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  const toggleFullscreen = () => {
    if (isVideo && videoRef.current) {
      if (!document.fullscreenElement) {
        videoRef.current.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    } else if (containerRef.current) {
      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    }
  };

  const handleFullscreenChange = () => {
    const fullscreenEl = document.fullscreenElement;
    if (fullscreenEl === videoRef.current || fullscreenEl === containerRef.current) {
      setIsFullscreen(true);
    } else {
      setIsFullscreen(false);
      setCssFullscreen(false); // Always reset CSS fullscreen when exiting native fullscreen
    }
  };

  useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeout) {
      clearTimeout(controlsTimeout);
      setControlsTimeout(null);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const currentMedia = combinedMedia[activeMediaIndex];
  const isVideo = currentMedia?.type === 'video';

  const imageContainerRef = useRef<HTMLDivElement>(null);

  const handleFullscreen = () => {
    if (imageContainerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        imageContainerRef.current.requestFullscreen();
      }
    }
  };

  // Utility: check if Fullscreen API is supported for the element
  const canUseFullscreenAPI = () => {
    const el = isVideo ? videoRef.current : imageContainerRef.current;
    return el && typeof el.requestFullscreen === 'function';
  };

  // Unified fullscreen handler
  const handleUnifiedFullscreen = () => {
    const el = isVideo ? videoRef.current : imageContainerRef.current;
    if (canUseFullscreenAPI() && el) {
      if (!document.fullscreenElement) {
        el.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    } else {
      setCssFullscreen((prev) => !prev);
    }
  };

  // Exit CSS fullscreen on Escape key
  useEffect(() => {
    if (!cssFullscreen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setCssFullscreen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [cssFullscreen]);

  if (combinedMedia.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">No media available</p>
      </div>
    );
  }

  return (
    <>
      <div className="portfolio-media-gallery">
        {/* Main Media Display */}
        <AnimatePresence>
          {(isFullscreen || cssFullscreen) ? (
            <motion.div
              key="fullscreen-container"
              ref={containerRef}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-50 w-screen h-screen max-w-none max-h-none rounded-none flex items-center justify-center overflow-hidden bg-black"
              onMouseMove={handleMouseMove}
              onMouseLeave={() => {
                if (isPlaying) {
                  const timeout = setTimeout(() => setShowControls(false), 2000);
                  setControlsTimeout(timeout);
                }
              }}
            >
              <motion.div
                key={currentMedia.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.25 }}
                className="w-full h-full flex items-center justify-center"
              >
                {isVideo ? (
                  <video
                    ref={videoRef}
                    src={currentMedia.url}
                    poster={currentMedia.video_poster || currentMedia.thumbnail}
                    autoPlay={currentMedia.video_autoplay}
                    muted={currentMedia.video_muted}
                    loop={currentMedia.video_loop}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onEnded={handleVideoEnded}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onVolumeChange={(e) => handleVolumeChange(e.currentTarget.volume)}
                    style={{
                      objectFit: 'contain',
                      maxWidth: '100vw',
                      maxHeight: '100vh',
                      width: 'auto',
                      height: 'auto',
                      display: 'block',
                      margin: '0 auto',
                      background: '#000',
                    }}
                    playsInline
                  />
                ) : (
                  <img
                    src={getHighQualityImageUrl(currentMedia.url)}
                    alt={currentMedia.title || 'Portfolio image'}
                    style={{
                      objectFit: 'contain',
                      maxWidth: '100vw',
                      maxHeight: '100vh',
                      width: 'auto',
                      height: 'auto',
                      display: 'block',
                      margin: '0 auto',
                    }}
                    className="rounded"
                    loading="eager"
                  />
                )}
                {/* Only show close (X) button in CSS fullscreen, not in native fullscreen */}
                {cssFullscreen && (
                  <button
                    onClick={() => setCssFullscreen(false)}
                    className="absolute top-2 left-2 bg-black bg-opacity-60 text-white rounded-full p-2 hover:bg-opacity-80 transition z-10"
                    title="Exit Fullscreen"
                    aria-label="Exit Fullscreen"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
                {/* Only show minimize icon in native fullscreen */}
                {isFullscreen && !cssFullscreen && (
                  <button
                    onClick={toggleFullscreen}
                    className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors z-10"
                    title="Exit Fullscreen"
                    aria-label="Exit Fullscreen"
                  >
                    <Minimize2 size={24} />
                  </button>
                )}
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="gallery-container"
              ref={containerRef}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.25 }}
              className="relative bg-black rounded-lg overflow-hidden aspect-[16/9]"
              onMouseMove={handleMouseMove}
              onMouseLeave={() => {
                if (isPlaying) {
                  const timeout = setTimeout(() => setShowControls(false), 2000);
                  setControlsTimeout(timeout);
                }
              }}
            >
              <motion.div
                key={currentMedia.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.25 }}
                className="w-full h-full"
              >
                <div className="flex items-center justify-center h-full w-full relative">
                  {combinedMedia.length > 1 && (
                    <button
                      onClick={handlePrevious}
                      className="bg-black/50 hover:bg-black/70 text-white p-3 sm:p-2 rounded-full transition-colors z-10 mr-2"
                      style={{ touchAction: 'manipulation' }}
                    >
                      <SkipBack size={28} className="mx-auto" />
                    </button>
                  )}
                  {isVideo ? (
                    <video
                      ref={videoRef}
                      src={currentMedia.url}
                      poster={currentMedia.video_poster || currentMedia.thumbnail}
                      autoPlay={currentMedia.video_autoplay}
                      muted={currentMedia.video_muted}
                      loop={currentMedia.video_loop}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                      onEnded={handleVideoEnded}
                      onTimeUpdate={handleTimeUpdate}
                      onLoadedMetadata={handleLoadedMetadata}
                      onVolumeChange={(e) => handleVolumeChange(e.currentTarget.volume)}
                      className="w-full h-full object-contain max-h-[80vh] rounded"
                      style={{
                        objectFit: 'contain',
                        width: '100%',
                        height: '100%',
                      }}
                      playsInline
                    />
                  ) : (
                    <img
                      src={getHighQualityImageUrl(currentMedia.url)}
                      alt={currentMedia.title || 'Portfolio image'}
                      className="rounded mx-auto w-full h-full"
                      style={{
                        objectFit: 'contain',
                        width: '100%',
                        height: '100%',
                      }}
                      loading="eager"
                    />
                  )}
                  {combinedMedia.length > 1 && (
                    <button
                      onClick={handleNext}
                      className="bg-black/50 hover:bg-black/70 text-white p-3 sm:p-2 rounded-full transition-colors z-10 ml-2"
                      style={{ touchAction: 'manipulation' }}
                    >
                      <SkipForward size={28} className="mx-auto" />
                    </button>
                  )}
                  {/* Only show fullscreen icon when not in any fullscreen mode */}
                  {!isFullscreen && !cssFullscreen && (
                    <button
                      onClick={handleUnifiedFullscreen}
                      className="absolute top-2 right-2 bg-black bg-opacity-60 text-white rounded-full p-2 hover:bg-opacity-80 transition"
                      title="Fullscreen"
                      type="button"
                      aria-label="Fullscreen"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9V5.25A1.5 1.5 0 015.25 3.75H9m6 0h3.75a1.5 1.5 0 011.5 1.5V9m0 6v3.75a1.5 1.5 0 01-1.5 1.5H15m-6 0H5.25a1.5 1.5 0 01-1.5-1.5V15" />
                      </svg>
                    </button>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Fullscreen Close Button */}
        {isFullscreen && (
          <button
            onClick={toggleFullscreen}
            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors z-10"
          >
            <Minimize2 size={24} />
          </button>
        )}
      </div>

      {/* Media Information */}
      {!isFullscreen && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {currentMedia.title}
          </h3>
          {currentMedia.description && (
            <p className="text-gray-600 dark:text-gray-400 mb-3">
              {currentMedia.description}
            </p>
          )}
          {/* Removed video metadata display (Duration, Audio, Autoplay, Loop) */}
        </div>
      )}

      {/* Thumbnail Navigation */}
      {!isFullscreen && combinedMedia.length > 1 && (
        <div className="mt-6">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {combinedMedia.map((media, index) => (
              <button
                key={media.id}
                onClick={() => handleMediaChange(index)}
                className={`flex-shrink-0 relative group ${
                  index === activeMediaIndex ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <div className="w-20 h-20 rounded-lg overflow-hidden">
                  {media.type === 'video' ? (
                    <video
                      src={media.url}
                      poster={media.video_poster || media.thumbnail}
                      className="w-full h-full object-cover"
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      controls={false}
                      onMouseOver={e => e.currentTarget.play()}
                      onMouseOut={e => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
                    />
                  ) : (
                    <img
                      src={media.thumbnail}
                      alt={`${media.type} thumbnail`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  )}
                </div>
                
                {/* Media Type Indicator */}
                <div className="absolute top-1 right-1 bg-black/70 text-white text-xs px-1 py-0.5 rounded">
                  {media.type === 'video' ? 'VID' : 'IMG'}
                </div>
                
                {/* Play Icon for Videos */}
                {media.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play size={16} className="text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
          
          {/* Media Counter */}
          <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
            {activeMediaIndex + 1} of {combinedMedia.length}
          </div>
        </div>
      )}

      {/* Project Stats */}
      {!isFullscreen && (
        <div className="mt-6 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Eye size={16} />
              {project.view_count} views
            </span>
            <span>
              {portfolioService.getImageCount(project)} images, {portfolioService.getVideoCount(project)} videos
            </span>
          </div>
          <span>
            {new Date(project.created_at).toLocaleDateString()}
          </span>
        </div>
      )}
    </>
  );
};

// Utility to get high quality Cloudinary image URL
function getHighQualityImageUrl(url: string): string {
  if (!url) return url;
  // If Cloudinary, inject q_auto:best,dpr_auto after /upload/
  if (url.includes('res.cloudinary.com') && url.includes('/upload/')) {
    return url.replace('/upload/', '/upload/q_auto:best,dpr_auto/');
  }
  return url;
}

export default PortfolioMediaGallery; 