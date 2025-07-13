import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, Award, Users, Heart } from 'lucide-react';
import Section from '../components/common/Section';
import Button from '../components/common/Button';
import { Link } from 'react-router-dom';
import Card from '../components/common/Card';
import teamService, { TeamMember } from '../services/teamService';
import homepageService, { HomepageElement } from '../services/homepageService';

// Type assertion for Card to allow subcomponent access
const CardAny = Card as any;

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

  // Team state
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // About (Our Story) state
  const [aboutElement, setAboutElement] = useState<HomepageElement | null>(null);
  useEffect(() => {
    homepageService.getElementsByType('about', true).then(elements => {
      setAboutElement(elements && elements.length > 0 ? elements[0] : null);
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);
    teamService.getTeamMembers()
      .then((members: TeamMember[]) => {
        setTeam(members.filter((m: TeamMember) => m.is_active !== false).sort((a: TeamMember, b: TeamMember) => a.order_index - b.order_index));
      })
      .catch(() => setError('Failed to load team members.'))
      .finally(() => setLoading(false));
  }, []);

  // Find founder from API
  const founder = team.find((m: TeamMember) => m.role.toLowerCase() === 'founder');
  const others = team.filter((m: TeamMember) => m.role.toLowerCase() !== 'founder');

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
            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">{aboutElement?.title || 'Our Story'}</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {aboutElement?.description || 'Founded in 2013, Manish Photography began as a passion project by Manish Kumar, a photography enthusiast with a vision to capture life\'s most precious moments in a unique and artistic way.'}
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
              src={aboutElement?.media_url || 'https://images.pexels.com/photos/3014856/pexels-photo-3014856.jpeg'} 
              alt={aboutElement?.title || 'Photography session'} 
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
              src={founder ? founder.photo_url : 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg'}
              alt={founder ? founder.name : 'Manish Kumar, Lead Photographer'}
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
            <h2 className="text-3xl font-bold mb-6 text-white">{founder ? `Meet ${founder.name}` : 'Meet Manish Kumar'}</h2>
            <p className="text-gray-300 mb-4">
              {founder ? founder.bio : 'With over a decade of experience in photography and cinematography, Manish Kumar has developed a distinctive style that blends artistic vision with technical expertise.'}
            </p>
            <p className="text-gray-300 mb-4">
              {founder ? '' : 'His work has been featured in several wedding publications, and he has photographed events across India, Southeast Asia, and Europe.'}
            </p>
            <p className="text-gray-300 mb-6">
              {founder ? '' : '"Photography is not just about creating images, but about preserving emotions and telling stories that will be cherished for generations."'}
            </p>
            <p className="text-gray-400 italic">- {founder ? founder.name : 'Manish Kumar'}, Founder</p>
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

      {/* Team Section */}
      <Section title="Meet the Team" subtitle="Our passionate professionals behind the lens">
        {loading ? (
          <div className="text-center py-8">Loading team members...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : (
          <div className="flex flex-col items-center w-full">
            {founder && (
              <div className="w-full flex justify-center mb-14">
                <CardAny className="flex flex-col items-center gap-6 p-10 bg-gradient-to-br from-white via-blue-50 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-3xl shadow-2xl border border-blue-100 dark:border-blue-900 max-w-2xl w-full relative overflow-hidden">
                  <div className="w-44 h-44 rounded-full overflow-hidden border-4 border-blue-500 shadow-lg bg-white mb-4">
                    <img src={founder.photo_url} alt={founder.name} className="w-full h-full object-cover" />
                  </div>
                  <CardAny.Content className="flex flex-col items-center text-center w-full">
                    <CardAny.Title className="text-4xl md:text-5xl font-extrabold mb-2 text-gray-900 dark:text-white tracking-tight leading-tight">
                      {founder.name}
                    </CardAny.Title>
                    <span className="inline-block px-4 py-1 mb-3 rounded-full bg-gradient-to-r from-fuchsia-500 to-blue-600 text-white font-bold uppercase tracking-widest text-base md:text-lg shadow-md border-2 border-white dark:border-gray-800">
                      {founder.role}
                    </span>
                    <CardAny.Description className="text-gray-700 dark:text-gray-300 text-lg md:text-xl leading-relaxed font-medium">{founder.bio}</CardAny.Description>
                  </CardAny.Content>
                </CardAny>
              </div>
            )}
            {others.length > 0 && (
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {others.map((member: TeamMember) => (
                  <CardAny key={member.id} className="flex flex-col items-center p-7 bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 hover:shadow-blue-200 dark:hover:shadow-blue-900 transition-shadow duration-300 group h-full relative overflow-hidden">
                    <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-blue-400 shadow-md bg-white mb-4 group-hover:scale-105 transition-transform duration-300">
                      <img src={member.photo_url} alt={member.name} className="w-full h-full object-cover" />
                    </div>
                    <CardAny.Content className="text-center flex-1 flex flex-col items-center w-full">
                      <CardAny.Title className="text-xl font-bold text-gray-900 dark:text-white mb-1 leading-tight">{member.name}</CardAny.Title>
                      <p className="text-blue-600 font-semibold mb-1 uppercase tracking-wide text-xs md:text-sm">{member.role}</p>
                      <CardAny.Description className="text-gray-600 dark:text-gray-300 text-base leading-relaxed font-medium">{member.bio}</CardAny.Description>
                    </CardAny.Content>
                  </CardAny>
                ))}
              </div>
            )}
            {!founder && others.length === 0 && (
              <div className="text-center text-gray-500 py-8">No team members to display.</div>
            )}
          </div>
        )}
      </Section>
    </div>
  );
};

export default About;