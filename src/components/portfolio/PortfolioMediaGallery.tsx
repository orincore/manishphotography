import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, SkipForward, SkipBack, Maximize2, Minimize2, RotateCcw, Eye } from 'lucide-react';
import { PortfolioProject, PortfolioImage, PortfolioVideo } from '../../types';
import portfolioService from '../../services/portfolioService';
import ReactPlayer from 'react-player';
import Lightbox from '../common/Lightbox';

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

const PortfolioMediaGallery: React.FC<PortfolioMediaGalleryProps> = ({ project, onMediaChange }) => {
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [combinedMedia, setCombinedMedia] = useState<CombinedMedia[]>([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const [isVideoFullscreen, setIsVideoFullscreen] = useState(false);
  const [isHoveringControls, setIsHoveringControls] = useState(false);
  useEffect(() => {
    const images = (project.images || []).map(img => ({
      id: img.id,
      type: 'image' as const,
      url: img.image_url,
      thumbnail: img.thumbnail_url,
      title: project.title,
      description: project.description,
    }));
    const videos = (project.videos || []).map(vid => ({
      id: vid.id,
      type: 'video' as const,
      url: vid.video_url,
      thumbnail: vid.video_thumbnail_url,
      title: project.title,
      description: project.description,
      video_loop: vid.video_loop,
      video_muted: vid.video_muted,
    }));
    setCombinedMedia([...images, ...videos]);
  }, [project]);
  useEffect(() => { onMediaChange?.(activeMediaIndex); }, [activeMediaIndex, onMediaChange]);
  useEffect(() => {
    function onFullscreenChange() {
      const fullscreenEl = document.fullscreenElement || (document as any).webkitFullscreenElement || (document as any).msFullscreenElement || (document as any).mozFullScreenElement;
      setIsVideoFullscreen(!!fullscreenEl && !!videoContainerRef.current && fullscreenEl === videoContainerRef.current);
    }
    document.addEventListener('fullscreenchange', onFullscreenChange);
    document.addEventListener('webkitfullscreenchange', onFullscreenChange);
    document.addEventListener('mozfullscreenchange', onFullscreenChange);
    document.addEventListener('MSFullscreenChange', onFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', onFullscreenChange);
      document.removeEventListener('mozfullscreenchange', onFullscreenChange);
      document.removeEventListener('MSFullscreenChange', onFullscreenChange);
    };
  }, []);
  const currentMedia = combinedMedia[activeMediaIndex];
  const isVideo = currentMedia?.type === 'video';
  const imageItems = combinedMedia.filter(m => m.type === 'image').map(img => ({
    id: img.id,
    src: img.url,
    alt: img.title || 'Portfolio image',
    title: img.title,
    description: img.description,
  }));
  const imageIndex = imageItems.findIndex(img => img.id === currentMedia?.id);
  if (!currentMedia) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">No media available</p>
      </div>
    );
  }
  return (
    <div className="portfolio-media-gallery">
      <div className="w-full h-full flex items-center justify-center relative" style={{ minHeight: 400 }}>
        {isVideo ? (
          <div
            ref={videoContainerRef}
            style={{ position: 'relative', width: '100%', height: '100%' }}
            onContextMenu={e => e.preventDefault()}
          >
            <ReactPlayer
              src={currentMedia.url}
              controls
              width="100%"
              height="100%"
              loop={currentMedia.video_loop}
              muted={currentMedia.video_muted}
              playsInline
              style={{ objectFit: 'contain', background: '#000', maxHeight: '80vh', borderRadius: 8 }}
              onMouseEnter={() => setIsHoveringControls(true)}
              onMouseLeave={() => setIsHoveringControls(false)}
            />
          </div>
        ) : (
          <img
            src={currentMedia.url}
            alt={currentMedia.title || 'Portfolio image'}
            style={{ objectFit: 'contain', width: '100%', height: '100%', maxHeight: '80vh', borderRadius: 8, background: '#000', cursor: 'zoom-in' }}
            loading="eager"
            onClick={() => setLightboxOpen(true)}
          />
        )}
        {/* Navigation buttons, etc. can remain here if needed */}
      </div>
      {/* Thumbnails, navigation, and other UI can remain unchanged */}
      {/* Lightbox for images */}
      <Lightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={imageItems}
        initialIndex={imageIndex >= 0 ? imageIndex : 0}
      />
    </div>
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