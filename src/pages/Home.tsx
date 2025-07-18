import { useEffect } from 'react';
import Hero from '../components/home/Hero';
import FeaturedWork from '../components/home/FeaturedWork';
import Testimonials from '../components/home/Testimonials';
import CallToAction from '../components/home/CallToAction';

const Home = () => {
  useEffect(() => {
    // Update page title
    document.title = 'Manish Photography - Wedding Photography & Cinematography';
  }, []);
  
  return (
    <div className="min-h-screen">
      <Hero />
      <FeaturedWork />
      <Testimonials />
      <CallToAction />
    </div>
  );
};

export default Home;