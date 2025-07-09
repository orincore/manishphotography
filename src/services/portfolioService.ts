import api from './api';

export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  image_url: string;
  image_public_id: string;
  thumbnail_url: string;
  is_published: boolean;
  view_count: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  portfolio_subcategories?: {
    id: string;
    name: string;
    slug: string;
    client_name: string;
    portfolio_categories: {
      id: string;
      name: string;
      slug: string;
    };
  };
}

export interface PortfolioResponse {
  message: string;
  projects: PortfolioProject[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

export interface CreateProjectData {
  title: string;
  description: string;
  category: string;
  tags: string[];
  featured: boolean;
  published: boolean;
  images: File[];
}

export interface UpdateProjectData extends Partial<CreateProjectData> {
  images?: File[];
}

export interface PortfolioSubcategory {
  id: string;
  name: string;
  slug: string;
  client_name: string;
  event_date?: string;
  location?: string;
  cover_image_url: string;
  cover_image_public_id?: string;
  description?: string;
  is_active?: boolean;
  display_order?: number;
  created_at?: string;
  updated_at?: string;
  project_count?: number | { count: number } | Array<{ count: number }>;
  portfolio_categories?: {
    id: string;
    name: string;
    slug: string;
  };
  portfolio_projects?: PortfolioProject[];
}

export interface PortfolioCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  thumbnail_url?: string;
  portfolio_subcategories: PortfolioSubcategory[];
}

export interface PortfolioTag {
  id: string;
  name: string;
}

export interface CategoriesResponse {
  message: string;
  categories: PortfolioCategory[];
}

export interface CategoryResponse {
  message: string;
  category: PortfolioCategory;
}

export interface SubcategoryResponse {
  message: string;
  subcategory: PortfolioSubcategory;
}

export interface PortfolioStats {
  totalProjects: number;
  publishedProjects: number;
  featuredProjects: number;
  categories: number;
}

export interface SearchParams {
  query?: string;
  category?: string;
  subcategory?: string;
  tags?: string[];
  featured?: boolean;
  page?: number;
  limit?: number;
}

export const fetchCategories = async () => {
  const response = await api.get('/portfolio/categories');
  return response.data.categories || [];
};

export const fetchSubcategories = async (categoryId: string) => {
  try {
    const response = await api.get(`/portfolio/categories`);
    return response.data.subcategories || [];
  } catch (err: any) {
    // If 404, just return empty array
    if (err?.response?.status === 404) return [];
    throw err;
  }
};

export const createPortfolioProject = async (formData: FormData) => {
  // formData should include: title, description, categoryId, subcategoryId, tags, isPublished, images[]
  const response = await api.post('/portfolio/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const createCategory = async (name: string, description = '', displayOrder: number = 10) => {
  const trimmedName = name.trim();
  if (!trimmedName) throw new Error('Category name is required');
  const slug = trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const body = {
    name: trimmedName,
    slug,
    description: description || '',
    displayOrder: typeof displayOrder === 'number' && !isNaN(displayOrder) ? displayOrder : 10
  };
  const response = await api.post('/portfolio/categories', body);
  return response.data.category || response.data;
};

export const fetchPublishedProjects = async (page = 1, limit = 10) => {
  const response = await api.get(`/portfolio/published?page=${page}&limit=${limit}`);
  return response.data.projects || [];
};

// Use 'snug' (not 'slug') for category lookup
export const fetchCategoryBySnug = async (snug: string) => {
  const response = await api.get(`/portfolio/categories/${snug}`);
  return response.data.category || response.data;
};

// Update fetchCategoryById to use 'snug' as well
export const fetchCategoryById = async (categoryIdOrSnug: string) => {
  const response = await api.get(`/portfolio/categories/${categoryIdOrSnug}`);
  return response.data.category || response.data;
};

class PortfolioService {
  // Get featured projects for homepage
  async getFeaturedProjects(): Promise<PortfolioProject[]> {
    const response = await api.get<PortfolioProject[]>('/portfolio/featured');
    return response.data;
  }

  // Get all published projects
  async getPublishedProjects(params?: SearchParams): Promise<PortfolioResponse> {
    const response = await api.get<PortfolioResponse>('/portfolio/published', { params });
    return response.data;
  }

  // Get project by ID
  async getProject(projectId: string): Promise<PortfolioProject> {
    const response = await api.get<PortfolioProject>(`/portfolio/${projectId}`);
    return response.data;
  }

  // Get all categories with subcategories
  async getCategories(): Promise<CategoriesResponse> {
    const response = await api.get<CategoriesResponse>('/portfolio/categories');
    return response.data;
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

  // Get tags
  async getTags(): Promise<PortfolioTag[]> {
    const response = await api.get<PortfolioTag[]>('/portfolio/tags');
    return response.data;
  }

  // Search projects
  async searchProjects(params: SearchParams): Promise<PortfolioProject[]> {
    const response = await api.get<PortfolioProject[]>('/portfolio/search', { params });
    return response.data;
  }

  // Admin: Create new project
  async createProject(projectData: CreateProjectData): Promise<PortfolioProject> {
    const formData = new FormData();
    
    // Add text fields
    formData.append('title', projectData.title);
    formData.append('description', projectData.description);
    formData.append('category', projectData.category);
    formData.append('featured', projectData.featured.toString());
    formData.append('published', projectData.published.toString());
    
    // Add tags as JSON string
    formData.append('tags', JSON.stringify(projectData.tags));
    
    // Add images
    projectData.images.forEach((image, index) => {
      formData.append('images', image);
    });

    const response = await api.post<PortfolioProject>('/portfolio', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Admin: Update project
  async updateProject(projectId: string, projectData: UpdateProjectData): Promise<PortfolioProject> {
    const formData = new FormData();
    
    // Add text fields if provided
    if (projectData.title) formData.append('title', projectData.title);
    if (projectData.description) formData.append('description', projectData.description);
    if (projectData.category) formData.append('category', projectData.category);
    if (projectData.featured !== undefined) formData.append('featured', projectData.featured.toString());
    if (projectData.published !== undefined) formData.append('published', projectData.published.toString());
    if (projectData.tags) formData.append('tags', JSON.stringify(projectData.tags));
    
    // Add new images if provided
    if (projectData.images) {
      projectData.images.forEach((image) => {
        formData.append('images', image);
      });
    }

    const response = await api.put<PortfolioProject>(`/portfolio/${projectId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Admin: Delete project
  async deleteProject(projectId: string): Promise<void> {
    await api.delete(`/portfolio/${projectId}`);
  }

  // Admin: Toggle project publish status
  async togglePublish(projectId: string): Promise<PortfolioProject> {
    const response = await api.patch<PortfolioProject>(`/portfolio/${projectId}/publish`);
    return response.data;
  }

  // Admin: Get portfolio statistics
  async getStats(): Promise<PortfolioStats> {
    const response = await api.get<PortfolioStats>('/portfolio/admin/stats');
    return response.data;
  }
}

export default new PortfolioService(); 