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