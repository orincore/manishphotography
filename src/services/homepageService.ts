import api from './api';

export interface HomepageElement {
  id: string;
  type: 'hero' | 'featured' | 'instagram' | 'about' | 'gallery' | 'testimonial' | 'service' | 'contact' | 'hero-video' | 'featured-video';
  title?: string;
  subtitle?: string;
  description?: string;
  image_url?: string | null;
  video_url?: string | null;
  thumbnail_url?: string | null;
  media_url?: string | null;
  media_type?: 'image' | 'video';
  media_public_id?: string;
  file_path?: string | null;
  file_size?: number | null;
  file_type?: string | null;
  mime_type?: string | null;
  width?: number | null;
  height?: number | null;
  duration?: number | null;
  order_index: number;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string | null;
  users?: {
    name: string;
    email: string;
  };
  // Video-specific fields
  video_autoplay?: boolean;
  video_muted?: boolean;
  video_loop?: boolean;
}

export interface CreateHomepageElementData {
  type: 'hero' | 'featured' | 'instagram' | 'about' | 'gallery' | 'testimonial' | 'service' | 'contact' | 'hero-video' | 'featured-video';
  title?: string;
  subtitle?: string;
  description?: string;
  order_index?: number;
  is_active?: boolean;
  is_featured?: boolean;
  // Video-specific fields
  video_autoplay?: boolean;
  video_muted?: boolean;
  video_loop?: boolean;
}

export interface UpdateHomepageElementData {
  title?: string;
  subtitle?: string;
  description?: string;
  order_index?: number;
  is_active?: boolean;
  is_featured?: boolean;
  // Video-specific fields
  video_autoplay?: boolean;
  video_muted?: boolean;
  video_loop?: boolean;
}

export interface HomepageStats {
  totalElements: number;
  activeElements: number;
  heroImages: number;
  heroVideos: number;
  featuredImages: number;
}

export interface HomepagePreview {
  heroElements: HomepageElement[];
  featuredImages: HomepageElement[];
  instagramImages: HomepageElement[];
  aboutImages: HomepageElement[];
  galleryImages: HomepageElement[];
  testimonials: HomepageElement[];
  services: HomepageElement[];
  contactInfo: HomepageElement[];
}

class HomepageService {
  // ===== PUBLIC ENDPOINTS (No Auth Required) =====

  // Get all homepage elements (public)
  async getAllElements(params?: any): Promise<{ message: string; elements: HomepageElement[]; pagination?: any }> {
    const response = await api.get<{ message: string; elements: HomepageElement[]; pagination?: any }>('/homepage/elements', { params });
    return response.data;
  }

  // Get homepage preview (all data at once)
  async getHomepagePreview(): Promise<HomepagePreview> {
    try {
      const response = await api.get<HomepagePreview>('/homepage/preview');
      return response.data;
    } catch (error) {
      // Fallback: get all elements and organize them
      const allElements = await this.getAllElements();
      const elements = allElements.elements;
      
      return {
        heroElements: elements.filter(e => (e.type === 'hero' || e.type === 'hero-video') && e.is_active),
        featuredImages: elements.filter(e => e.type === 'featured' && e.is_active),
        instagramImages: elements.filter(e => e.type === 'instagram' && e.is_active),
        aboutImages: elements.filter(e => e.type === 'about' && e.is_active),
        galleryImages: elements.filter(e => e.type === 'gallery' && e.is_active),
        testimonials: elements.filter(e => e.type === 'testimonial' && e.is_active),
        services: elements.filter(e => e.type === 'service' && e.is_active),
        contactInfo: elements.filter(e => e.type === 'contact' && e.is_active),
      };
    }
  }

  // Get active hero elements (images + videos)
  async getActiveHeroElements(): Promise<HomepageElement[]> {
    try {
      const response = await api.get<{ message: string; elements: HomepageElement[] }>('/homepage/hero/active');
      return response.data.elements;
    } catch (error) {
      // Fallback: get all elements and filter for active hero elements
      const allElements = await this.getAllElements();
      return allElements.elements.filter(element => 
        (element.type === 'hero' || element.type === 'hero-video') && 
        element.is_active
      ).sort((a, b) => a.order_index - b.order_index);
    }
  }

  // Get hero videos only
  async getHeroVideos(): Promise<HomepageElement[]> {
    try {
      const response = await api.get<{ message: string; elements: HomepageElement[] }>('/homepage/hero/videos');
      return response.data.elements;
    } catch (error) {
      // Fallback: get all elements and filter for hero videos
      const allElements = await this.getAllElements();
      return allElements.elements.filter(element => 
        element.type === 'hero-video' && element.is_active
      ).sort((a, b) => a.order_index - b.order_index);
    }
  }

  // Get featured images
  async getFeaturedImages(): Promise<HomepageElement[]> {
    try {
      const response = await api.get<{ message: string; elements: HomepageElement[] }>('/homepage/featured/images');
      return response.data.elements;
    } catch (error) {
      // Fallback: get all elements and filter for featured images
      const allElements = await this.getAllElements();
      return allElements.elements.filter(element => 
        element.type === 'featured' && element.is_active
      ).sort((a, b) => a.order_index - b.order_index);
    }
  }

  // Get Instagram feed images
  async getInstagramImages(): Promise<HomepageElement[]> {
    try {
      const response = await api.get<{ message: string; elements: HomepageElement[] }>('/homepage/instagram/images');
      return response.data.elements;
    } catch (error) {
      // Fallback: get all elements and filter for instagram images
      const allElements = await this.getAllElements();
      return allElements.elements.filter(element => 
        element.type === 'instagram' && element.is_active
      ).sort((a, b) => a.order_index - b.order_index);
    }
  }

  // Get elements by type with optional active filter
  async getElementsByType(type: string, activeOnly: boolean = true): Promise<HomepageElement[]> {
    try {
      const params = activeOnly ? { active_only: true } : {};
      const response = await api.get<{ message: string; elements: HomepageElement[] }>(`/homepage/elements/type/${type}`, { params });
      return response.data.elements;
    } catch (error) {
      // Fallback: get all elements and filter
      const allElements = await this.getAllElements();
      return allElements.elements.filter(element => 
        element.type === type && (!activeOnly || element.is_active)
      ).sort((a, b) => a.order_index - b.order_index);
    }
  }

  // ===== ADMIN ENDPOINTS (Auth Required) =====

  // Get single homepage element
  async getElement(id: string): Promise<{ message: string; element: HomepageElement }> {
    const response = await api.get<{ message: string; element: HomepageElement }>(`/homepage/elements/${id}`);
    return response.data;
  }

  // Create new homepage element
  async createElement(data: FormData): Promise<{ message: string; element: HomepageElement; uploadId?: string }> {
    const response = await api.post<{ message: string; element: HomepageElement; uploadId?: string }>('/homepage/elements', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Update homepage element
  async updateElement(id: string, data: UpdateHomepageElementData): Promise<{ message: string; element: HomepageElement }> {
    const response = await api.put<{ message: string; element: HomepageElement }>(`/homepage/elements/${id}`, data);
    return response.data;
  }

  // Upload media for homepage element
  async uploadMedia(id: string, mediaFile: File): Promise<{ message: string; element: HomepageElement }> {
    const formData = new FormData();
    formData.append('media', mediaFile);
    
    const response = await api.post<{ message: string; element: HomepageElement }>(`/homepage/elements/${id}/media`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Delete homepage element
  async deleteElement(id: string): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/homepage/elements/${id}`);
    return response.data;
  }

  // Toggle element active status
  async toggleActiveStatus(id: string, isActive: boolean): Promise<{ message: string; element: HomepageElement }> {
    const response = await api.patch<{ message: string; element: HomepageElement }>(`/homepage/elements/${id}/toggle-active`, { is_active: isActive });
    return response.data;
  }

  // Reorder elements
  async reorderElements(elementIds: string[]): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>('/homepage/elements/reorder', { element_ids: elementIds });
    return response.data;
  }

  // Get homepage statistics
  async getHomepageStats(): Promise<HomepageStats> {
    try {
      const response = await api.get<HomepageStats>('/homepage/stats');
      return response.data;
    } catch (error) {
      // Fallback: calculate stats from all elements
      const allElements = await this.getAllElements();
      const elements = allElements.elements;
      
      return {
        totalElements: elements.length,
        activeElements: elements.filter(e => e.is_active).length,
        heroImages: elements.filter(e => e.type === 'hero' && e.media_type === 'image').length,
        heroVideos: elements.filter(e => e.type === 'hero-video' && e.media_type === 'video').length,
        featuredImages: elements.filter(e => e.type === 'featured' && e.media_type === 'image').length,
      };
    }
  }

  // Bulk upload homepage elements
  async bulkUpload(elements: FormData): Promise<{ message: string; elements: HomepageElement[] }> {
    const response = await api.post<{ message: string; elements: HomepageElement[] }>('/homepage/elements/bulk-upload', elements, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // ===== CONVENIENCE METHODS =====

  // Get about section elements
  async getAboutElements(): Promise<HomepageElement[]> {
    return this.getElementsByType('about', true);
  }

  // Get gallery elements
  async getGalleryElements(): Promise<HomepageElement[]> {
    return this.getElementsByType('gallery', true);
  }

  // Get testimonial elements
  async getTestimonialElements(): Promise<HomepageElement[]> {
    return this.getElementsByType('testimonial', true);
  }

  // Get service elements
  async getServiceElements(): Promise<HomepageElement[]> {
    return this.getElementsByType('service', true);
  }

  // Get contact elements
  async getContactElements(): Promise<HomepageElement[]> {
    return this.getElementsByType('contact', true);
  }

  // Create hero image element
  async createHeroImage(data: {
    title?: string;
    subtitle?: string;
    description?: string;
    mediaFile: File;
    isActive?: boolean;
    isFeatured?: boolean;
  }): Promise<{ message: string; element: HomepageElement; uploadId?: string }> {
    const formData = new FormData();
    formData.append('type', 'hero');
    if (data.title) formData.append('title', data.title);
    if (data.subtitle) formData.append('subtitle', data.subtitle);
    if (data.description) formData.append('description', data.description);
    formData.append('media_file', data.mediaFile);
    if (data.isActive !== undefined) formData.append('is_active', data.isActive.toString());
    if (data.isFeatured !== undefined) formData.append('is_featured', data.isFeatured.toString());
    
    return this.createElement(formData);
  }

  // Create hero video element
  async createHeroVideo(data: {
    title?: string;
    subtitle?: string;
    description?: string;
    mediaFile: File;
    isActive?: boolean;
    isFeatured?: boolean;
    videoAutoplay?: boolean;
    videoMuted?: boolean;
    videoLoop?: boolean;
  }): Promise<{ message: string; element: HomepageElement; uploadId?: string }> {
    const formData = new FormData();
    formData.append('type', 'hero-video');
    if (data.title) formData.append('title', data.title);
    if (data.subtitle) formData.append('subtitle', data.subtitle);
    if (data.description) formData.append('description', data.description);
    formData.append('media_file', data.mediaFile);
    if (data.isActive !== undefined) formData.append('is_active', data.isActive.toString());
    if (data.isFeatured !== undefined) formData.append('is_featured', data.isFeatured.toString());
    if (data.videoAutoplay !== undefined) formData.append('video_autoplay', data.videoAutoplay.toString());
    if (data.videoMuted !== undefined) formData.append('video_muted', data.videoMuted.toString());
    if (data.videoLoop !== undefined) formData.append('video_loop', data.videoLoop.toString());
    
    return this.createElement(formData);
  }

  // Create testimonial element
  async createTestimonial(data: {
    title: string;
    subtitle?: string;
    description: string;
    isActive?: boolean;
    isFeatured?: boolean;
  }): Promise<{ message: string; element: HomepageElement; uploadId?: string }> {
    const formData = new FormData();
    formData.append('type', 'testimonial');
    formData.append('title', data.title);
    if (data.subtitle) formData.append('subtitle', data.subtitle);
    formData.append('description', data.description);
    if (data.isActive !== undefined) formData.append('is_active', data.isActive.toString());
    if (data.isFeatured !== undefined) formData.append('is_featured', data.isFeatured.toString());
    
    return this.createElement(formData);
  }
}

export default new HomepageService(); 