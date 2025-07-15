import { useState, useEffect } from 'react';
import homepageService, { HomepageElement, HomepagePreview } from '../services/homepageService';

interface UseHomepageDataReturn {
  data: HomepagePreview;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useHomepageData = (): UseHomepageDataReturn => {
  const [data, setData] = useState<HomepagePreview>({
    heroElements: [],
    featuredImages: [],
    instagramImages: [],
    aboutImages: [],
    galleryImages: [],
    testimonials: [],
    services: [],
    contactInfo: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const homepageData = await homepageService.getHomepagePreview();
      setData(homepageData);
    } catch (err) {
      console.error('Error fetching homepage data:', err);
      setError('Failed to load homepage content');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
};

// Hook for specific section data
export const useHomepageSection = (section: 'hero' | 'featured' | 'instagram' | 'about' | 'gallery' | 'testimonial' | 'service' | 'contact') => {
  const [elements, setElements] = useState<HomepageElement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSectionData = async () => {
    try {
      setLoading(true);
      setError(null);
      let sectionData: HomepageElement[] = [];

      switch (section) {
        case 'hero':
          sectionData = await homepageService.getActiveHeroElements();
          break;
        case 'featured':
          sectionData = await homepageService.getFeaturedImages();
          break;
        case 'instagram':
          sectionData = await homepageService.getInstagramImages();
          break;
        case 'about':
          sectionData = await homepageService.getAboutElements();
          break;
        case 'gallery':
          sectionData = await homepageService.getGalleryElements();
          break;
        case 'testimonial':
          sectionData = await homepageService.getTestimonialElements();
          break;
        case 'service':
          sectionData = await homepageService.getServiceElements();
          break;
        case 'contact':
          sectionData = await homepageService.getContactElements();
          break;
        default:
          sectionData = await homepageService.getElementsByType(section);
      }

      setElements(sectionData);
    } catch (err) {
      console.error(`Error fetching ${section} data:`, err);
      setError(`Failed to load ${section} content`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSectionData();
  }, [section]);

  return {
    elements,
    loading,
    error,
    refetch: fetchSectionData
  };
};

// Hook for hero section specifically
export const useHeroSection = () => {
  const [elements, setElements] = useState<HomepageElement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHeroData = async () => {
    try {
      setLoading(true);
      setError(null);
      const heroData = await homepageService.getActiveHeroElements();
      setElements(heroData);
    } catch (err) {
      console.error('Error fetching hero data:', err);
      setError('Failed to load hero content');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeroData();
  }, []);

  return {
    elements,
    loading,
    error,
    refetch: fetchHeroData
  };
};

// Hook for featured section specifically
export const useFeaturedSection = () => {
  return useHomepageSection('featured');
};

// Hook for Instagram section specifically
export const useInstagramSection = () => {
  return useHomepageSection('instagram');
};

// Hook for testimonials section specifically
export const useTestimonialsSection = () => {
  return useHomepageSection('testimonial');
};

// Hook for services section specifically
export const useServicesSection = () => {
  return useHomepageSection('service');
}; 