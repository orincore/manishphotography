# Admin Panel Flow Documentation

## Overview
The admin panel has been streamlined to have a single, consistent authentication and navigation flow.

## Admin Authentication Flow

### 1. Admin Login
- **URL**: `/admin/login`
- **Component**: `AdminLogin` (src/components/admin/AdminLogin.tsx)
- **Purpose**: Dedicated admin login page with proper styling and error handling

### 2. Admin Protected Routes
- **URL Pattern**: `/admin/*`
- **Protection**: `AdminProtectedRoute` component
- **Layout**: `AdminLayout` component with sidebar navigation

### 3. Admin Dashboard
- **URL**: `/admin/dashboard`
- **Component**: `AdminDashboard` (src/pages/admin/AdminDashboard.tsx)
- **Features**: 
  - Real-time statistics from API
  - Charts and analytics
  - Quick access to key admin functions

### 4. Admin Categories Management
- **URL**: `/admin/categories`
- **Component**: `CategoriesList` (src/pages/admin/CategoriesList.tsx)
- **Features**:
  - CRUD operations for categories
  - Real-time API integration
  - Error handling and validation

## Navigation

### From Main Site
- **Admin Users**: See "Admin" link in header when logged in
- **Regular Users**: See "Dashboard" link in header when logged in
- **Non-authenticated**: See "Login/Register" links

### Admin Panel Navigation
- **Sidebar**: Persistent navigation with all admin sections
- **Top Bar**: Page title and "View Site" link
- **Logout**: Available in sidebar footer

## Security

### Authentication Checks
- `AdminProtectedRoute` verifies:
  - User is authenticated
  - User has admin role
- Redirects to `/admin/login` if not authenticated
- Redirects to `/` if authenticated but not admin

### Session Management
- Uses `useAuthStore` for state management
- JWT tokens stored securely
- Automatic logout on token expiration

## API Integration

### Real Data Sources
- Dashboard stats calculated from categories API
- Categories management uses dedicated API endpoints
- Error handling for API failures
- Fallback to mock data when needed

## File Structure

```
src/
├── components/admin/
│   ├── AdminLogin.tsx          # Admin login form
│   ├── AdminLayout.tsx         # Admin panel layout
│   ├── ProtectedRoute.tsx      # Admin route protection
│   ├── DashboardStats.tsx      # Dashboard statistics
│   ├── DashboardChart.tsx      # Dashboard charts
│   └── ...
├── pages/admin/
│   ├── AdminDashboard.tsx      # Main dashboard page
│   └── CategoriesList.tsx      # Categories management
└── routes/index.tsx            # Route definitions
```

## Usage

1. Navigate to `/admin/login`
2. Enter admin credentials
3. Access dashboard at `/admin/dashboard`
4. Use sidebar to navigate between admin sections
5. Click "View Site" to return to main site
6. Use "Logout" to end admin session

## Troubleshooting

- **Cannot access admin**: Ensure user has admin role
- **Login fails**: Check credentials and API connectivity
- **Dashboard not loading**: Verify API endpoints are accessible
- **Navigation issues**: Clear browser cache and try again 