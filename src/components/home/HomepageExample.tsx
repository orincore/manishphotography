import React from 'react';
import { useHomepageData, useTestimonialsSection, useServicesSection } from '../../hooks/useHomepageData';
import { HomepageElement } from '../../services/homepageService';

// Example component showing how to use the homepage data hooks
const HomepageExample: React.FC = () => {
  const { data, loading, error, refetch } = useHomepageData();
  const { elements: testimonials } = useTestimonialsSection();
  const { elements: services } = useServicesSection();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading homepage content...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">Error: {error}</div>
          <button 
            onClick={refetch}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gray-900 text-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Hero Section</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.heroElements.map((element) => (
              <HeroCard key={element.id} element={element} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Images */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Featured Images</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.featuredImages.map((element) => (
              <ImageCard key={element.id} element={element} />
            ))}
          </div>
        </div>
      </section>

      {/* Instagram Feed */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Instagram Feed</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {data.instagramImages.map((element) => (
              <InstagramCard key={element.id} element={element} />
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">About Section</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {data.aboutImages.map((element) => (
              <AboutCard key={element.id} element={element} />
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Gallery</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {data.galleryImages.map((element) => (
              <GalleryCard key={element.id} element={element} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Testimonials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.testimonials.map((element) => (
              <TestimonialCard key={element.id} element={element} />
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.services.map((element) => (
              <ServiceCard key={element.id} element={element} />
            ))}
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.contactInfo.map((element) => (
              <ContactCard key={element.id} element={element} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

// Card Components
const HeroCard: React.FC<{ element: HomepageElement }> = ({ element }) => (
  <div className="bg-gray-800 rounded-lg p-6">
    <h3 className="text-xl font-semibold mb-2">{element.title}</h3>
    <p className="text-gray-300 mb-2">{element.subtitle}</p>
    <p className="text-sm text-gray-400">{element.description}</p>
    <div className="mt-4 text-sm text-gray-500">
      Type: {element.type} | Active: {element.is_active ? 'Yes' : 'No'}
    </div>
  </div>
);

const ImageCard: React.FC<{ element: HomepageElement }> = ({ element }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    {element.media_url && (
      <img 
        src={element.media_url} 
        alt={element.title || 'Featured image'} 
        className="w-full h-48 object-cover"
      />
    )}
    <div className="p-4">
      <h3 className="font-semibold mb-2">{element.title}</h3>
      <p className="text-sm text-gray-600">{element.description}</p>
    </div>
  </div>
);

const InstagramCard: React.FC<{ element: HomepageElement }> = ({ element }) => (
  <div className="aspect-square overflow-hidden rounded-lg">
    {element.media_url && (
      <img 
        src={element.media_url} 
        alt={element.title || 'Instagram image'} 
        className="w-full h-full object-cover hover:scale-110 transition-transform"
      />
    )}
  </div>
);

const AboutCard: React.FC<{ element: HomepageElement }> = ({ element }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    {element.media_url && (
      <img 
        src={element.media_url} 
        alt={element.title || 'About image'} 
        className="w-full h-64 object-cover"
      />
    )}
    <div className="p-6">
      <h3 className="text-xl font-semibold mb-2">{element.title}</h3>
      <p className="text-gray-600 mb-2">{element.subtitle}</p>
      <p className="text-sm text-gray-500">{element.description}</p>
    </div>
  </div>
);

const GalleryCard: React.FC<{ element: HomepageElement }> = ({ element }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    {element.media_url && (
      <img 
        src={element.media_url} 
        alt={element.title || 'Gallery image'} 
        className="w-full h-48 object-cover"
      />
    )}
    <div className="p-4">
      <h3 className="font-semibold">{element.title}</h3>
    </div>
  </div>
);

const TestimonialCard: React.FC<{ element: HomepageElement }> = ({ element }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex items-center mb-4">
      <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
        <span className="text-gray-600 font-semibold">
          {element.title?.charAt(0) || 'T'}
        </span>
      </div>
      <div className="ml-4">
        <h3 className="font-semibold">{element.title}</h3>
        <p className="text-sm text-gray-600">{element.subtitle}</p>
      </div>
    </div>
    <p className="text-gray-700 italic">"{element.description}"</p>
  </div>
);

const ServiceCard: React.FC<{ element: HomepageElement }> = ({ element }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <h3 className="text-xl font-semibold mb-2">{element.title}</h3>
    <p className="text-gray-600 mb-2">{element.subtitle}</p>
    <p className="text-sm text-gray-500">{element.description}</p>
  </div>
);

const ContactCard: React.FC<{ element: HomepageElement }> = ({ element }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <h3 className="text-xl font-semibold mb-2">{element.title}</h3>
    <p className="text-gray-600 mb-2">{element.subtitle}</p>
    <p className="text-sm text-gray-500">{element.description}</p>
  </div>
);

export default HomepageExample; 