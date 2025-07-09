import axios from 'axios';
import { PortfolioCategory, PortfolioSubcategory, PortfolioProject } from './portfolioService';

const API_BASE = '/api';

// Create axios instance with auth token
const adminApi = axios.create({
  baseURL: API_BASE,
});

// Add auth token to requests
adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export interface DashboardStats {
  totalCategories: number;
  totalSubcategories: number;
  totalProjects: number;
  totalFeedback: number;
  totalContacts: number;
  totalViews: number;
}

export interface CategoryFormData {
  name: string;
  slug: string;
  description: string;
  display_order: number;
  is_active: boolean;
  thumbnail_url?: string;
}

export interface SubcategoryFormData {
  category_id: string;
  name: string;
  slug: string;
  description: string;
  client_name: string;
  event_date?: string;
  location?: string;
  display_order: number;
  is_active: boolean;
  cover_image_url?: string;
}

export interface ProjectFormData {
  title: string;
  description: string;
  category: string;
  subcategory_id?: string;
  tags: string[];
  is_published: boolean;
  image_url?: string;
  thumbnail_url?: string;
}

const adminService = {
  // Dashboard
  getDashboardStats: async (): Promise<DashboardStats> => {
    try {
      // For now, let's use the categories API to get some basic stats
      const categoriesResponse = await adminApi.get('/portfolio/categories');
      const categories = categoriesResponse.data.categories || [];
      
      // Calculate basic stats from available data
      const totalCategories = categories.length;
      const totalSubcategories = categories.reduce((sum: number, cat: any) => {
        return sum + (Array.isArray(cat.portfolio_subcategories) ? cat.portfolio_subcategories.length : 0);
      }, 0);
      
      // Return calculated stats
      return {
        totalCategories,
        totalSubcategories,
        totalProjects: 0, // Will be calculated when projects API is available
        totalFeedback: 0, // Will be calculated when feedback API is available
        totalContacts: 0, // Will be calculated when contacts API is available
        totalViews: 0     // Will be calculated when analytics API is available
      };
    } catch (error) {
      console.warn('Dashboard stats API not available, using fallback data');
      // Return fallback data if API is not available
      return {
        totalCategories: 0,
        totalSubcategories: 0,
        totalProjects: 0,
        totalFeedback: 0,
        totalContacts: 0,
        totalViews: 0
      };
    }
  },

  // Categories
  getCategories: async (): Promise<{ categories: PortfolioCategory[] }> => {
    try {
      const response = await adminApi.get('/portfolio/categories');
      return response.data;
    } catch (error) {
      console.warn('Categories API not available, using fallback data');
      // Return fallback data if API is not available
      return {
        categories: []
      };
    }
  },

  getCategory: async (id: string): Promise<{ category: PortfolioCategory }> => {
    const response = await adminApi.get(`/portfolio/categories/${id}`);
    return response.data;
  },

  createCategory: async (data: CategoryFormData): Promise<{ category: PortfolioCategory }> => {
    const response = await adminApi.post('/portfolio/categories', data);
    return response.data;
  },

  updateCategory: async (categoryId: string, data: CategoryFormData): Promise<{ category: PortfolioCategory }> => {
    const response = await adminApi.put(`/portfolio/categories/${categoryId}`, data);
    return response.data;
  },

  deleteCategory: async (slug: string): Promise<void> => {
    await adminApi.delete(`/portfolio/category/${slug}`);
  },

  // Subcategories
  getSubcategories: async (): Promise<{ subcategories: PortfolioSubcategory[] }> => {
    const response = await adminApi.get('/portfolio/subcategories');
    return response.data;
  },

  getSubcategory: async (id: string): Promise<{ subcategory: PortfolioSubcategory }> => {
    const response = await adminApi.get(`/portfolio/subcategories/${id}`);
    return response.data;
  },

  createSubcategory: async (data: FormData): Promise<{ subcategory: PortfolioSubcategory }> => {
    const response = await adminApi.post('/portfolio/subcategories', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateSubcategory: async (id: string, data: FormData): Promise<{ subcategory: PortfolioSubcategory }> => {
    const response = await adminApi.put(`/portfolio/subcategories/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteSubcategory: async (id: string): Promise<void> => {
    await adminApi.delete(`/portfolio/subcategories/${id}`);
  },

  // Projects
  getProjects: async (params?: any): Promise<{ projects: PortfolioProject[]; pagination: any }> => {
    const response = await adminApi.get('/portfolio/admin/all', { params });
    return response.data;
  },

  getProject: async (id: string): Promise<{ project: PortfolioProject }> => {
    const response = await adminApi.get(`/portfolio/${id}`);
    return response.data;
  },

  createProject: async (data: FormData): Promise<{ project: PortfolioProject }> => {
    const response = await adminApi.post('/portfolio', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateProject: async (projectId: string, data: any): Promise<{ project: PortfolioProject }> => {
    const token = localStorage.getItem('authToken');
    const response = await axios.put(
      `http://localhost:3000/api/portfolio/${projectId}`,
      data,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      }
    );
    return response.data;
  },

  deleteProject: async (projectId: string): Promise<void> => {
    const token = localStorage.getItem('authToken');
    await axios.delete(`http://localhost:3000/api/portfolio/project/${projectId}`,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      }
    );
  },

  togglePublishStatus: async (id: string, isPublished: boolean): Promise<void> => {
    await adminApi.patch(`/portfolio/${id}/publish`, { is_published: isPublished });
  },

  // Feedback
  getFeedback: async (params?: any): Promise<{ feedback: any[]; pagination: any }> => {
    const response = await adminApi.get('/feedback', { params });
    return response.data;
  },

  deleteFeedback: async (id: string): Promise<void> => {
    await adminApi.delete(`/feedback/${id}`);
  },

  // Contacts
  getContacts: async (params?: any): Promise<{ contacts: any[]; pagination: any }> => {
    const response = await adminApi.get('/contact', { params });
    return response.data;
  },

  deleteContact: async (id: string): Promise<void> => {
    await adminApi.delete(`/contact/${id}`);
  },

  // Instagram
  getInstagramPosts: async (): Promise<{ posts: any[] }> => {
    const response = await adminApi.get('/instagram/posts');
    return response.data;
  },

  updateInstagramSettings: async (data: any): Promise<void> => {
    await adminApi.put('/instagram/settings', data);
  },
};

export default adminService; 