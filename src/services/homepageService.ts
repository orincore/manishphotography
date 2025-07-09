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
}

export interface CreateHomepageElementData {
  type: 'hero' | 'featured' | 'instagram' | 'about' | 'gallery' | 'testimonial' | 'service' | 'contact' | 'hero-video' | 'featured-video';
  title?: string;
  subtitle?: string;
  description?: string;
  order_index?: number;
  is_active?: boolean;
  is_featured?: boolean;
}

export interface UpdateHomepageElementData {
  title?: string;
  subtitle?: string;
  description?: string;
  order_index?: number;
  is_active?: boolean;
  is_featured?: boolean;
}

export interface HomepageStats {
  totalElements: number;
  activeElements: number;
  heroImages: number;
  heroVideos: number;
  featuredImages: number;
}

class HomepageService {
  // Get all homepage elements
  async getAllElements(params?: any): Promise<{ message: string; elements: HomepageElement[]; pagination: any }> {
    const response = await api.get<{ message: string; elements: HomepageElement[]; pagination: any }>('/homepage/elements', { params });
    return response.data;
  }

  // Get homepage elements by type
  async getElementsByType(type: string): Promise<HomepageElement[]> {
    const response = await api.get<{ message: string; elements: HomepageElement[] }>(`/homepage/elements/type/${type}`);
    return response.data.elements;
  }

  // Get active hero elements (images and videos)
  async getActiveHeroElements(): Promise<HomepageElement[]> {
    try {
      // Try the specific hero endpoint first
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

  // Get featured images
  async getFeaturedImages(): Promise<HomepageElement[]> {
    try {
      const response = await api.get<{ message: string; elements: HomepageElement[] }>('/homepage/featured/images');
      return response.data.elements;
    } catch (error) {
      // Fallback: get all elements and filter for featured images
      const allElements = await this.getAllElements();
      return allElements.elements.filter(element => 
        element.is_featured && 
        (element.media_type === 'image' || element.type.includes('image'))
      );
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
      );
    }
  }

  // Get single homepage element
  async getElement(id: string): Promise<{ message: string; element: HomepageElement }> {
    const response = await api.get<{ message: string; element: HomepageElement }>(`/homepage/elements/${id}`);
    return response.data;
  }

  // Create new homepage element
  async createElement(data: FormData): Promise<{ message: string; element: HomepageElement }> {
    const response = await api.post<{ message: string; element: HomepageElement }>('/homepage/elements', data, {
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
        featuredImages: elements.filter(e => e.is_featured && e.media_type === 'image').length,
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

  // Get homepage preview data
  async getHomepagePreview(): Promise<{
    heroElements: HomepageElement[];
    featuredImages: HomepageElement[];
    instagramImages: HomepageElement[];
    aboutImages: HomepageElement[];
  }> {
    try {
      const response = await api.get<{
        heroElements: HomepageElement[];
        featuredImages: HomepageElement[];
        instagramImages: HomepageElement[];
        aboutImages: HomepageElement[];
      }>('/homepage/preview');
      return response.data;
    } catch (error) {
      // Fallback: get all elements and organize them
      const allElements = await this.getAllElements();
      const elements = allElements.elements;
      
      return {
        heroElements: elements.filter(e => (e.type === 'hero' || e.type === 'hero-video') && e.is_active),
        featuredImages: elements.filter(e => e.is_featured && e.media_type === 'image'),
        instagramImages: elements.filter(e => e.type === 'instagram' && e.is_active),
        aboutImages: elements.filter(e => e.type === 'about' && e.is_active),
      };
    }
  }
}

export default new HomepageService(); 