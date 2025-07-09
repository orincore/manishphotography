import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, Award, Users, Heart } from 'lucide-react';
import Section from '../components/common/Section';
import Button from '../components/common/Button';
import { Link } from 'react-router-dom';

const About = () => {
  useEffect(() => {
    // Update page title
    document.title = 'About Us - Manish Photography';
  }, []);

  const stats = [
    { icon: <Camera className="w-8 h-8 text-blue-600" />, value: '1000+', label: 'Photo Sessions' },
    { icon: <Award className="w-8 h-8 text-blue-600" />, value: '150+', label: 'Wedding Films' },
    { icon: <Users className="w-8 h-8 text-blue-600" />, value: '500+', label: 'Happy Clients' },
    { icon: <Heart className="w-8 h-8 text-blue-600" />, value: '10+', label: 'Years Experience' },
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[400px] bg-cover bg-center flex items-center" style={{backgroundImage: 'url(https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg)'}}>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="container mx-auto px-4 relative z-10 text-center text-white">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
          >
            About Manish Photography
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl max-w-2xl mx-auto"
          >
            Capturing life's precious moments through the art of photography and cinematography
          </motion.p>
        </div>
      </div>

      {/* About Section */}
      <Section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Our Story</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Founded in 2013, Manish Photography began as a passion project by Manish Kumar, a photography enthusiast with a vision to capture life's most precious moments in a unique and artistic way.
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              What started as a small portrait studio has grown into one of the region's most sought-after photography and cinematography services, specializing in weddings, pre-wedding shoots, and commercial photography.
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Our approach combines traditional techniques with modern aesthetics, creating timeless imagery that tells your unique story. We believe that the best photographs capture not just how things looked, but how they felt.
            </p>
            <Link to="/contact">
              <Button>Get In Touch</Button>
            </Link>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="rounded-lg overflow-hidden shadow-xl"
          >
            <img 
              src="https://images.pexels.com/photos/3014856/pexels-photo-3014856.jpeg" 
              alt="Photography session" 
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </Section>

      {/* Meet the Photographer */}
      <Section darkBg>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-2 md:order-1 rounded-lg overflow-hidden shadow-xl"
          >
            <img 
              src="https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg" 
              alt="Manish Kumar, Lead Photographer" 
              className="w-full h-full object-cover"
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-1 md:order-2"
          >
            <h2 className="text-3xl font-bold mb-6 text-white">Meet Manish Kumar</h2>
            <p className="text-gray-300 mb-4">
              With over a decade of experience in photography and cinematography, Manish Kumar has developed a distinctive style that blends artistic vision with technical expertise.
            </p>
            <p className="text-gray-300 mb-4">
              His work has been featured in several wedding publications, and he has photographed events across India, Southeast Asia, and Europe.
            </p>
            <p className="text-gray-300 mb-6">
              "Photography is not just about creating images, but about preserving emotions and telling stories that will be cherished for generations."
            </p>
            <p className="text-gray-400 italic">- Manish Kumar, Founder</p>
          </motion.div>
        </div>
      </Section>

      {/* Stats Section */}
      <Section title="Our Achievements" subtitle="Numbers that speak for themselves">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md"
            >
              <div className="flex justify-center mb-4">
                {stat.icon}
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{stat.value}</h3>
              <p className="text-gray-600 dark:text-gray-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </Section>


    </div>
  );
};

export default About;