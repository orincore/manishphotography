import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { images } from '../../data/images';
import { videos } from '../../data/videos';
import Section from '../common/Section';
import Card from '../common/Card';
import Button from '../common/Button';

const FeaturedWork = () => {
  const [activeTab, setActiveTab] = useState<'photos' | 'videos'>('photos');
  
  const featuredPhotos = images.filter(image => image.featured).slice(0, 4);
  const featuredVideos = videos.filter(video => video.featured).slice(0, 3);
  
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
        duration: 0.6,
      },
    },
  };

  return (
    <Section 
      title="Featured Work" 
      subtitle="A showcase of our finest photography and cinematography projects"
    >
      <div className="mb-8 flex justify-center">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            onClick={() => setActiveTab('photos')}
            className={`px-6 py-2 text-sm font-medium border rounded-l-lg ${
              activeTab === 'photos'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700'
            }`}
          >
            Photography
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('videos')}
            className={`px-6 py-2 text-sm font-medium border rounded-r-lg ${
              activeTab === 'videos'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700'
            }`}
          >
            Cinematography
          </button>
        </div>
      </div>

      <div className="mt-8">
        {activeTab === 'photos' && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {featuredPhotos.map((photo) => (
              <motion.div key={photo.id} variants={itemVariants}>
                <Link to={`/portfolio?category=photos&id=${photo.id}`}>
                  <Card>
                    <Card.Image
                      src={photo.src}
                      alt={photo.title}
                      aspectRatio="square"
                    />
                    <Card.Content>
                      <Card.Title>{photo.title}</Card.Title>
                      <Card.Description>{photo.description}</Card.Description>
                    </Card.Content>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}

        {activeTab === 'videos' && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {featuredVideos.map((video) => (
              <motion.div key={video.id} variants={itemVariants}>
                <Link to={`/portfolio?category=cinematics&id=${video.id}`}>
                  <Card>
                    <Card.Image
                      src={video.thumbnail}
                      alt={video.title}
                      aspectRatio="video"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="rounded-full bg-white bg-opacity-80 p-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-8 h-8 text-blue-600"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                    <Card.Content>
                      <Card.Title>{video.title}</Card.Title>
                      <Card.Description>{video.description}</Card.Description>
                    </Card.Content>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <div className="mt-12 text-center">
        <Link to="/portfolio">
          <Button size="lg">View All Work</Button>
        </Link>
      </div>
    </Section>
  );
};

export default FeaturedWork;