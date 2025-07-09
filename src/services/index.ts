// Export all API services
export { default as api } from './api';
export { default as authService } from './authService';
export { default as portfolioService } from './portfolioService';
export { default as adminService } from './adminService';
export { default as feedbackService } from './feedbackService';
export { default as homepageService } from './homepageService';
export { default as contactService } from './contactService';
export { default as instagramService } from './instagramService';

// Export types
export type {
  LoginData,
  RegisterData,
  UserProfile,
  AuthResponse,
} from './authService';

export type {
  PortfolioProject,
  PortfolioResponse,
  PortfolioCategory,
  PortfolioSubcategory,
  CategoriesResponse,
  SubcategoryResponse,
  PortfolioTag,
  PortfolioStats,
  SearchParams,
} from './portfolioService';

export type {
  Feedback,
  CreateFeedbackData,
  UpdateFeedbackData,
  FeedbackSummary,
  FeedbackStats,
  BulkModerateData,
} from './feedbackService';

export type {
  HomepageElement,
  CreateHomepageElementData,
  UpdateHomepageElementData,
  HomepageStats,
} from './homepageService';

export type {
  ContactMessage,
  CreateContactData,
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

export type {
  CreateCategoryData,
  CreateSubcategoryData,
  CreateProjectData,
  UpdateProjectData,
  AdminPortfolioStats,
} from './adminService'; 