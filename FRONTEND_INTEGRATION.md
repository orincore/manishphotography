# Frontend Integration Guide

This document outlines how the frontend React application integrates with the backend API endpoints.

## 🚀 Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_API_BASE_URL=https://api.manishbosephotography.com/api
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
src/
├── services/           # API service layer
│   ├── api.ts         # Axios configuration & interceptors
│   ├── authService.ts # Authentication API calls
│   ├── portfolioService.ts # Portfolio/Projects API calls
│   ├── feedbackService.ts # Feedback system API calls
│   ├── contactService.ts # Contact form API calls
│   └── instagramService.ts # Instagram integration API calls
├── store/             # State management
│   └── useAuthStore.ts # Authentication state
├── hooks/             # Custom hooks
│   └── useAuthCheck.ts # Authentication check hook
├── components/        # React components
│   └── common/
│       └── ProtectedRoute.tsx # Route protection component
└── types/             # TypeScript interfaces
```

## 🔐 Authentication Integration

### API Configuration
- **Base URL**: Configured via `VITE_API_BASE_URL` environment variable
- **Token Storage**: JWT tokens stored in `localStorage`
- **Auto-refresh**: Automatic token validation on app startup
- **Error Handling**: Automatic redirect to login on 401/403 errors

### Authentication Flow
1. **Login**: `POST /api/auth/login`
2. **Register**: `POST /api/auth/register`
3. **Profile**: `GET /api/auth/profile`
4. **Token Management**: Automatic token attachment to requests

### Protected Routes
- **Admin Routes**: Require both authentication and admin role
- **User Routes**: Require authentication only
- **Public Routes**: No authentication required

## 📸 Portfolio Integration

### Public Endpoints
- **Featured Projects**: `GET /api/portfolio/featured`
- **Published Projects**: `GET /api/portfolio/published`
- **Project Details**: `GET /api/portfolio/:projectId`
- **Categories**: `GET /api/portfolio/categories`
- **Tags**: `GET /api/portfolio/tags`
- **Search**: `GET /api/portfolio/search`

### Admin Endpoints
- **Create Project**: `POST /api/portfolio/` (multipart/form-data)
- **Update Project**: `PUT /api/portfolio/:projectId`
- **Delete Project**: `DELETE /api/portfolio/:projectId`
- **Toggle Publish**: `PATCH /api/portfolio/:projectId/publish`
- **Statistics**: `GET /api/portfolio/admin/stats`

### File Upload
- **Image Upload**: Supports multiple images via FormData
- **File Validation**: Client-side file type and size validation
- **Progress Tracking**: Upload progress indicators

## 💬 Feedback System Integration

### Client Features
- **Submit Feedback**: `POST /api/feedback/` (requires login)
- **Edit Feedback**: `PUT /api/feedback/:feedbackId/user`
- **Delete Feedback**: `DELETE /api/feedback/:feedbackId/user`
- **View Own Feedback**: `GET /api/feedback/user/me`

### Public Display
- **Approved Feedback**: `GET /api/feedback/approved`
- **Project Feedback**: `GET /api/feedback/project/:projectId`
- **Feedback Summary**: `GET /api/feedback/summary`

### Admin Features
- **Moderate Feedback**: `PATCH /api/feedback/:feedbackId/moderate`
- **Bulk Moderate**: `POST /api/feedback/bulk/moderate`
- **Statistics**: `GET /api/feedback/admin/stats`

## 📞 Contact Form Integration

### Public Submission
- **Submit Contact**: `POST /api/contact/`
- **Form Validation**: Client-side validation with error display
- **Success Handling**: Success messages and form reset

### Admin Management
- **List Contacts**: `GET /api/contact/admin/all`
- **Contact Stats**: `GET /api/contact/admin/stats`
- **Mark Read/Unread**: `PATCH /api/contact/admin/:contactId/read|unread`
- **Delete Contact**: `DELETE /api/contact/admin/:contactId`
- **Bulk Actions**: `POST /api/contact/admin/bulk/read|delete`
- **Export**: `GET /api/contact/admin/export`
- **Search**: `GET /api/contact/admin/search`

## 📱 Instagram Integration

### Public Endpoints
- **Profile**: `GET /api/instagram/profile`
- **Posts**: `GET /api/instagram/posts`
- **Homepage Feed**: `GET /api/instagram/homepage`
- **Stories**: `GET /api/instagram/stories`
- **Post Details**: `GET /api/instagram/post/:postId`

### Admin Features
- **Post Insights**: `GET /api/instagram/post/:postId/insights`

## 🛠️ Error Handling

### Global Error Handling
- **Network Errors**: Automatic retry with exponential backoff
- **Authentication Errors**: Automatic redirect to login
- **Validation Errors**: User-friendly error messages
- **Server Errors**: Generic error messages with logging

### Error Display
- **Form Errors**: Field-specific error messages
- **Toast Notifications**: Success/error notifications
- **Loading States**: Loading spinners and disabled states

## 🔄 State Management

### Authentication State
- **User Profile**: Current user information
- **Authentication Status**: Login/logout state
- **Loading States**: API call loading indicators
- **Error States**: Error messages and handling

### Data Caching
- **Portfolio Data**: Cached project data with refresh
- **User Data**: Cached user profile information
- **Categories/Tags**: Cached for performance

## 🎨 UI/UX Features

### Responsive Design
- **Mobile First**: Optimized for mobile devices
- **Tablet Support**: Responsive layouts for tablets
- **Desktop Experience**: Enhanced features for desktop

### Dark Mode
- **Theme Toggle**: User preference storage
- **System Preference**: Automatic theme detection
- **Consistent Styling**: Dark mode across all components

### Loading States
- **Skeleton Loaders**: Content placeholders
- **Spinner Indicators**: Loading animations
- **Progress Bars**: Upload progress tracking

## 🔧 Development Tools

### TypeScript
- **Type Safety**: Full TypeScript integration
- **Interface Definitions**: Shared types across components
- **API Types**: Generated from backend schemas

### Development Server
- **Hot Reload**: Automatic page refresh on changes
- **Error Overlay**: In-browser error display
- **Source Maps**: Debug-friendly development

### Build Optimization
- **Code Splitting**: Lazy-loaded components
- **Tree Shaking**: Unused code elimination
- **Asset Optimization**: Compressed images and fonts

## 🚀 Deployment

### Environment Configuration
- **Production API**: Configure production API URL
- **Environment Variables**: Secure configuration management
- **Build Optimization**: Production-ready builds

### Performance Optimization
- **Bundle Analysis**: Webpack bundle analyzer
- **Lazy Loading**: Route-based code splitting
- **Caching Strategy**: Browser caching optimization

## 📝 API Documentation

For detailed API documentation, refer to the backend API documentation or the individual service files in `src/services/`.

## 🤝 Contributing

1. Follow the existing code structure
2. Add TypeScript types for new features
3. Include error handling for API calls
4. Test authentication flows
5. Update this documentation for new features

## 🐛 Troubleshooting

### Common Issues
1. **CORS Errors**: Ensure backend CORS is configured
2. **Authentication Issues**: Check token storage and API endpoints
3. **File Upload Failures**: Verify multipart/form-data handling
4. **Environment Variables**: Ensure `.env` file is properly configured

### Debug Tools
- **Browser DevTools**: Network tab for API debugging
- **React DevTools**: Component state inspection
- **Redux DevTools**: State management debugging 