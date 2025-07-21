import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { VideoItem } from '../../types';

interface VideoGalleryProps {
  videos: VideoItem[];
}

const VideoGallery: React.FC<VideoGalleryProps> = ({ videos }) => {
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

  const handleVideoClick = (videoUrl: string) => {
    window.open(videoUrl, '_blank');
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      {videos.map((video) => (
        <motion.div
          key={video.id}
          variants={itemVariants}
          className="rounded-lg bg-white dark:bg-gray-800 shadow-md hover:shadow-xl transition-shadow overflow-hidden flex flex-col cursor-pointer"
          onClick={() => handleVideoClick(video.videoUrl)}
        >
          {/* Inner video area with overlay */}
          <div className="aspect-video relative bg-black">
            <video
              src={video.videoUrl}
              poster={video.thumbnail}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              muted
              loop
              playsInline
              preload="metadata"
              controls={false}
              onMouseOver={e => e.currentTarget.play()}
              onMouseOut={e => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
            />
            {/* Play button overlay only on video area */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="flex items-center justify-center rounded-full bg-white bg-opacity-80 p-4">
                <Play size={32} className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>
          {/* Card content (title, description) below video */}
          <div className="p-5 flex-1 flex flex-col justify-between">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {video.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {video.description}
            </p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default VideoGallery;