export interface ImageItem {
  id: string;
  title: string;
  description: string;
  src: string;
  category: string;
  subcategory?: string;
  featured?: boolean;
  tags?: string[];
  createdAt: string;
}

export interface VideoItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  category: string;
  featured?: boolean;
  tags?: string[];
  createdAt: string;
}

// New Portfolio Media Types
export interface PortfolioImage {
  id: string;
  project_id: string;
  image_url: string;
  image_public_id: string;
  thumbnail_url: string;
  created_at: string;
}

export interface PortfolioVideo {
  id: string;
  project_id: string;
  video_url: string;
  video_public_id: string;
  video_thumbnail_url: string;
  video_duration: number;
  video_autoplay: boolean;
  video_muted: boolean;
  video_loop: boolean;
  video_poster: string | null;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  is_published: boolean;
  snug: string;
  image_url: string;
  image_public_id: string;
  thumbnail_url: string;
  view_count: number;
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
  images?: PortfolioImage[];
  videos?: PortfolioVideo[];
}

export interface PortfolioCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  display_order: number;
  is_active: boolean;
  portfolio_subcategories: PortfolioSubcategory[];
}

export interface PortfolioSubcategory {
  id: string;
  name: string;
  slug: string;
  client_name: string;
  event_date?: string;
  location?: string;
  cover_image_url: string;
  project_count?: number;
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
  projects: PortfolioProject[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

export interface PortfolioStats {
  message: string;
  stats: {
    total_projects: number;
    published_projects: number;
    total_images: number;
    total_videos: number;
    total_views: number;
  };
}

export interface SearchParams {
  page?: number;
  limit?: number;
  category?: string;
  subcategory?: string;
  query?: string;
  tags?: string | string[];
}

export interface VideoUploadSettings {
  video_autoplay: boolean;
  video_muted: boolean;
  video_loop: boolean;
  video_poster?: string;
  order_index: number;
}

export interface ProjectFormData {
  title: string;
  description: string;
  category: string;
  tags: string[];
  isPublished: boolean;
  subcategoryId?: string;
  images?: File[];
}

export interface TestimonialItem {
  id: string;
  name: string;
  avatar?: string;
  rating: number;
  text: string;
  date: string;
  location?: string;
  featured?: boolean;
}

export interface OfferItem {
  id: string;
  title: string;
  description: string;
  price: number;
  discountedPrice?: number;
  image: string;
  features: string[];
  popular?: boolean;
  expiryDate?: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  location?: string;
}

export interface CostEstimate {
  weddingType: 'in-city' | 'destination';
  location: string;
  distance: number;
  estimatedCost: number;
}

export interface Theme {
  mode: 'light' | 'dark';
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  serviceType: 'wedding' | 'pre-wedding' | 'event' | 'commercial';
  createdAt: string;
}