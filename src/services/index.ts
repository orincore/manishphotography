// Export all API services
export { default as api } from './api';
export { default as authService } from './authService';
export { default as portfolioService } from './portfolioService';
export { default as adminService } from './adminService';
export { default as feedbackService } from './feedbackService';
export { default as homepageService } from './homepageService';
export { default as contactService } from './contactService';
export { default as instagramService } from './instagramService';
export { default as teamService } from './teamService';
export { default as packageService } from './packageService';

// Export types
import type {
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
  PortfolioImage,
} from '../types';

export type {
  LoginData,
  RegisterData,
  UserProfile,
  AuthResponse,
} from './authService';

export type {
  Feedback,
  CreateFeedbackData,
  UpdateFeedbackData,
  FeedbackSummary,
  FeedbackStats,
  BulkModerateFeedbackData,
} from './feedbackService';

export type {
  HomepageElement,
  CreateHomepageElementData,
  UpdateHomepageElementData,
  HomepageStats,
} from './homepageService';

export type {
  ContactStats,
  ContactSearchParams,
  BulkActionData,
} from './contactService';

export type {
  InstagramProfile,
  InstagramPost,
  InstagramStory,
  InstagramInsights,
  HomepageFeed,
} from './instagramService'; 