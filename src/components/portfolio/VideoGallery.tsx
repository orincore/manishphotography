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
          className="overflow-hidden rounded-lg cursor-pointer"
          onClick={() => handleVideoClick(video.videoUrl)}
        >
          <div className="relative aspect-video overflow-hidden">
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="rounded-full bg-white/80 p-4"
              >
                <Play size={32} className="text-blue-600" />
              </motion.div>
            </div>
          </div>
          <div className="p-4 bg-white dark:bg-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{video.title}</h3>
            <p className="text-gray-600 dark:text-gray-300 mt-1">{video.description}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default VideoGallery;