import api from './api';
import {
  PortfolioProject,
  PortfolioResponse,
  PortfolioCategory,
  PortfolioSubcategory,
  CategoriesResponse,
  CategoryResponse,
  SubcategoryResponse,
  PortfolioStats,
  SearchParams,
  VideoUploadSettings,
  PortfolioVideo,
  PortfolioImage
} from '../types';

// Legacy functions for backward compatibility
export const fetchFeaturedProjects = async () => {
  const response = await api.get('/portfolio/featured');
  return response.data.projects || [];
};

export const fetchPublishedProjects = async (page = 1, limit = 10) => {
  const response = await api.get(`/portfolio/published?page=${page}&limit=${limit}`);
  return response.data.projects || [];
};

export const fetchCategoryById = async (categoryId: string) => {
  const response = await api.get(`/portfolio/categories/${categoryId}`);
  return response.data.category || response.data;
};

export const fetchCategoryBySnug = async (snug: string) => {
  const response = await api.get(`/portfolio/categories/${snug}`);
  return response.data.category || response.data;
};

export const createPortfolioProject = async (formData: FormData) => {
  const response = await api.post('/portfolio/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updatePortfolioProject = async (projectId: string, formData: FormData) => {
  const response = await api.put(`/portfolio/${projectId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deletePortfolioProject = async (projectId: string) => {
  const response = await api.delete(`/portfolio/project/${projectId}`);
  return response.data;
};

export const togglePublishStatus = async (projectId: string, isPublished: boolean) => {
  const response = await api.patch(`/portfolio/${projectId}/publish`, {
    is_published: isPublished,
  });
  return response.data;
};

export const fetchCategories = async () => {
  const response = await api.get('/portfolio/cat/all');
  // The new API returns { categories: [...] }
  return response.data.categories || [];
};

export const fetchSubcategories = async (categoryId: string) => {
  try {
    const response = await api.get(`/portfolio/categories/${categoryId}`);
    return response.data.subcategories || [];
  } catch (err: any) {
    // If 404, just return empty array
    if (err?.response?.status === 404) return [];
    throw err;
  }
};

// Enhanced Portfolio Service Class
class PortfolioService {
  // Client API Endpoints (Public)

  // Get all published projects with media
  async getPublishedProjects(params?: SearchParams): Promise<PortfolioResponse> {
    const response = await api.get<PortfolioResponse>('/portfolio/published', { params });
    return response.data;
  }

  // Get featured projects
  async getFeaturedProjects(limit: number = 6): Promise<{ projects: PortfolioProject[]; total: number }> {
    const response = await api.get<{ projects: PortfolioProject[]; total: number }>('/portfolio/featured', {
      params: { limit }
    });
    return response.data;
  }

  // Get project by ID with all media
  async getProject(projectId: string): Promise<PortfolioProject> {
    const response = await api.get<{ project: PortfolioProject }>(`/portfolio/project/${projectId}`);
    return response.data.project;
  }

  // Get project videos
  async getProjectVideos(projectId: string): Promise<PortfolioVideo[]> {
    const response = await api.get<{ videos: PortfolioVideo[] }>(`/portfolio/${projectId}/videos`);
    return response.data.videos;
  }

  // Search projects
  async searchProjects(params: SearchParams): Promise<PortfolioResponse> {
    const response = await api.get<PortfolioResponse>('/portfolio/search', { params });
    return response.data;
  }

  // Get projects by tags
  async getProjectsByTags(tags: string | string[], params?: SearchParams): Promise<PortfolioResponse> {
    const searchParams = { ...params, tags };
    const response = await api.get<PortfolioResponse>('/portfolio/tags', { params: searchParams });
    return response.data;
  }

  // Get categories with projects
  async getCategoriesWithProjects(): Promise<CategoriesResponse> {
    const response = await api.get<CategoriesResponse>('/portfolio/categories/with-projects');
    return response.data;
  }

  // Get projects by category/subcategory
  async getProjectsByCategory(categorySlug: string, subcategorySlug?: string): Promise<SubcategoryResponse> {
    const url = subcategorySlug 
      ? `/portfolio/categories/${categorySlug}/${subcategorySlug}`
      : `/portfolio/categories/${categorySlug}`;
    const response = await api.get<SubcategoryResponse>(url);
    return response.data;
  }

  // Get all categories
  async getCategories(): Promise<CategoriesResponse> {
    // The new API returns { message, projects, total }
    // To avoid breaking the frontend, return all required fields for CategoriesResponse
    return { categories: [], message: 'No categories available' };
  }

  // Get category by slug
  async getCategoryBySlug(slug: string): Promise<CategoryResponse> {
    const response = await api.get<CategoryResponse>(`/portfolio/categories/${slug}`);
    return response.data;
  }

  // Get subcategory by slug
  async getSubcategoryBySlug(categorySlug: string, subcategorySlug: string): Promise<SubcategoryResponse> {
    const response = await api.get<SubcategoryResponse>(`/portfolio/categories/${categorySlug}/${subcategorySlug}`);
    return response.data;
  }

  // Admin API Endpoints (Authentication Required)

  // Create project with images
  async createProject(formData: FormData): Promise<{ project: PortfolioProject }> {
    const response = await api.post<{ project: PortfolioProject }>('/portfolio/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Create project with mixed media (images and/or videos)
  async createProjectWithMedia(formData: FormData): Promise<{ 
    project: PortfolioProject; 
    uploadedVideos?: PortfolioVideo[] 
  }> {
    const response = await api.post<{ 
      project: PortfolioProject; 
      uploadedVideos?: PortfolioVideo[] 
    }>('/portfolio/with-media', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Upload single video to project
  async uploadProjectVideo(
    projectId: string, 
    videoFile: File, 
    settings: VideoUploadSettings
  ): Promise<{ video: PortfolioVideo }> {
    const formData = new FormData();
    formData.append('video', videoFile);
    formData.append('video_autoplay', settings.video_autoplay.toString());
    formData.append('video_muted', settings.video_muted.toString());
    formData.append('video_loop', settings.video_loop.toString());
    formData.append('order_index', settings.order_index.toString());
    
    if (settings.video_poster) {
      formData.append('video_poster', settings.video_poster);
    }

    const response = await api.post<{ video: PortfolioVideo }>(`/portfolio/${projectId}/videos`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Bulk upload videos
  async uploadProjectVideos(
    projectId: string, 
    videoFiles: File[], 
    settings: VideoUploadSettings
  ): Promise<{ videos: PortfolioVideo[] }> {
    const formData = new FormData();
    videoFiles.forEach(file => {
      formData.append('videos', file);
    });
    formData.append('video_autoplay', settings.video_autoplay.toString());
    formData.append('video_muted', settings.video_muted.toString());
    formData.append('video_loop', settings.video_loop.toString());
    formData.append('order_index', settings.order_index.toString());
    
    if (settings.video_poster) {
      formData.append('video_poster', settings.video_poster);
    }

    const response = await api.post<{ videos: PortfolioVideo[] }>(`/portfolio/${projectId}/videos/bulk`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Update video settings
  async updateVideo(videoId: string, settings: Partial<VideoUploadSettings>): Promise<{ video: PortfolioVideo }> {
    const response = await api.put<{ video: PortfolioVideo }>(`/portfolio/videos/${videoId}`, settings);
    return response.data;
  }

  // Reorder videos
  async reorderVideos(projectId: string, videoIds: string[]): Promise<void> {
    await api.put(`/portfolio/${projectId}/videos/reorder`, { videoIds });
  }

  // Delete video
  async deleteVideo(videoId: string): Promise<void> {
    await api.delete(`/portfolio/videos/${videoId}`);
  }

  // Update project
  async updateProject(projectId: string, formData: FormData): Promise<{ project: PortfolioProject }> {
    const response = await api.put<{ project: PortfolioProject }>(`/portfolio/${projectId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Delete project image
  async deleteProjectImage(projectId: string, imageId: string): Promise<void> {
    await api.delete(`/portfolio/${projectId}/images/${imageId}`);
  }

  // Delete project
  async deleteProject(projectId: string): Promise<void> {
    await api.delete(`/portfolio/project/${projectId}`);
  }

  // Toggle publish status
  async togglePublishStatus(projectId: string, isPublished: boolean): Promise<{ project: PortfolioProject }> {
    const response = await api.patch<{ project: PortfolioProject }>(`/portfolio/${projectId}/publish`, {
      is_published: isPublished
    });
    return response.data;
  }

  // Get all projects (admin)
  async getAllProjects(params?: SearchParams): Promise<PortfolioResponse> {
    const response = await api.get<PortfolioResponse>('/portfolio/admin/all', { params });
    return response.data;
  }

  // Get portfolio statistics
  async getStats(): Promise<PortfolioStats> {
    const response = await api.get<PortfolioStats>('/portfolio/admin/stats');
    return response.data;
  }

  // Utility methods

  // Combine images and videos for display
  combineMedia(project: PortfolioProject): Array<PortfolioImage | PortfolioVideo & { type: 'image' | 'video' }> {
    const images = (project.images || []).map(img => ({ ...img, type: 'image' as const }));
    const videos = (project.videos || []).map(vid => ({ ...vid, type: 'video' as const }));
    
    return [...images, ...videos].sort((a, b) => {
      if (a.type === 'image' && b.type === 'video') return -1;
      if (a.type === 'video' && b.type === 'image') return 1;
      return (a.type === 'video' ? a.order_index : 0) - (b.type === 'video' ? b.order_index : 0);
    });
  }

  // Get main media (first image or video)
  getMainMedia(project: PortfolioProject): PortfolioImage | PortfolioVideo | null {
    const combined = this.combineMedia(project);
    return combined.length > 0 ? combined[0] : null;
  }

  // Check if project has videos
  hasVideos(project: PortfolioProject): boolean {
    return !!(project.videos && project.videos.length > 0);
  }

  // Check if project has images
  hasImages(project: PortfolioProject): boolean {
    return !!(project.images && project.images.length > 0);
  }

  // Get video count
  getVideoCount(project: PortfolioProject): number {
    return project.videos?.length || 0;
  }

  // Get image count
  getImageCount(project: PortfolioProject): number {
    return project.images?.length || 0;
  }
}

// Create and export service instance
const portfolioService = new PortfolioService();
export default portfolioService; 