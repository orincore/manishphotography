# Portfolio Media System Implementation Guide

## Overview

This guide documents the comprehensive portfolio media system that supports both images and videos with audio capabilities, following the API specifications provided. The system provides a complete multimedia experience for showcasing photography and videography work.

## 🎯 Key Features

### ✅ Complete Media Support
- **Images**: Multiple images per project with automatic thumbnails
- **Videos**: Multiple videos per project with full audio support
- **Mixed Media**: Seamless integration of images and videos in galleries
- **Audio Controls**: Volume, mute, and audio settings for videos

### ✅ Advanced Management
- **Admin Interface**: Comprehensive project management with media uploads
- **Real-time Progress**: Upload progress tracking for large video files
- **Media Organization**: Ordering, categorization, and metadata management
- **Bulk Operations**: Multiple file uploads and batch management

### ✅ User Experience
- **Responsive Design**: Mobile-friendly media galleries
- **Smooth Animations**: Framer Motion powered transitions
- **Audio Support**: Full audio controls and settings
- **Navigation**: Intuitive media browsing and project navigation

## 📁 File Structure

```
src/
├── components/
│   ├── portfolio/
│   │   ├── PortfolioMediaGallery.tsx     # Main media gallery component
│   │   ├── ImageGallery.tsx              # Legacy image gallery
│   │   └── VideoGallery.tsx              # Legacy video gallery
│   └── admin/
│       └── PortfolioProjectManager.tsx   # Admin project management
├── pages/
│   ├── PortfolioProjectDetail.tsx        # Individual project page
│   └── Portfolio.tsx                     # Main portfolio page
├── services/
│   └── portfolioService.ts               # Enhanced portfolio API service
├── types/
│   └── index.ts                          # Updated TypeScript interfaces
└── hooks/
    └── useUploadProgress.ts              # Upload progress tracking
```

## 🔧 Implementation Details

### 1. Enhanced TypeScript Interfaces

The system uses comprehensive TypeScript interfaces for type safety:

```typescript
// Portfolio Media Types
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
  thumbnail_url: string;
  view_count: number;
  created_at: string;
  updated_at: string;
  images?: PortfolioImage[];
  videos?: PortfolioVideo[];
}
```

### 2. Enhanced Portfolio Service

The `portfolioService.ts` provides comprehensive API integration:

```typescript
class PortfolioService {
  // Client API Endpoints (Public)
  async getPublishedProjects(params?: SearchParams): Promise<PortfolioResponse>
  async getFeaturedProjects(limit?: number): Promise<{ projects: PortfolioProject[]; total: number }>
  async getProject(projectId: string): Promise<PortfolioProject>
  async getProjectVideos(projectId: string): Promise<PortfolioVideo[]>
  async searchProjects(params: SearchParams): Promise<PortfolioResponse>
  async getProjectsByTags(tags: string | string[], params?: SearchParams): Promise<PortfolioResponse>

  // Admin API Endpoints (Authentication Required)
  async createProject(formData: FormData): Promise<{ project: PortfolioProject }>
  async uploadProjectVideo(projectId: string, videoFile: File, settings: VideoUploadSettings): Promise<{ video: PortfolioVideo }>
  async uploadProjectVideos(projectId: string, videoFiles: File[], settings: VideoUploadSettings): Promise<{ videos: PortfolioVideo[] }>
  async updateVideo(videoId: string, settings: Partial<VideoUploadSettings>): Promise<{ video: PortfolioVideo }>
  async deleteVideo(videoId: string): Promise<void>
  async deleteProjectImage(projectId: string, imageId: string): Promise<void>

  // Utility Methods
  combineMedia(project: PortfolioProject): Array<PortfolioImage | PortfolioVideo & { type: 'image' | 'video' }>
  getMainMedia(project: PortfolioProject): PortfolioImage | PortfolioVideo | null
  hasVideos(project: PortfolioProject): boolean
  hasImages(project: PortfolioProject): boolean
  getVideoCount(project: PortfolioProject): number
  getImageCount(project: PortfolioProject): number
}
```

### 3. Portfolio Media Gallery Component

The `PortfolioMediaGallery.tsx` component provides a complete media viewing experience:

#### Features:
- **Combined Media Display**: Images and videos in a unified gallery
- **Audio Controls**: Volume, mute, and audio settings for videos
- **Smooth Navigation**: Previous/next navigation with animations
- **Thumbnail Navigation**: Visual thumbnail navigation
- **Auto-advance**: Videos auto-advance to next media when finished
- **Responsive Design**: Mobile-friendly interface

#### Key Methods:
```typescript
// Combine images and videos for display
const combined = [...images, ...videos].sort((a, b) => {
  if (a.type === 'image' && b.type === 'video') return -1;
  if (a.type === 'video' && b.type === 'image') return 1;
  return (a.type === 'video' ? a.order_index || 0 : 0) - (b.type === 'video' ? b.order_index || 0 : 0);
});

// Audio control methods
const handleVolumeChange = (newVolume: number) => {
  setVolume(newVolume);
  setIsMuted(newVolume === 0);
  if (videoRef) {
    videoRef.volume = newVolume;
    videoRef.muted = newVolume === 0;
  }
};
```

### 4. Admin Portfolio Project Manager

The `PortfolioProjectManager.tsx` provides comprehensive project management:

#### Features:
- **Project Creation**: Create projects with multiple images
- **Video Upload**: Upload videos with audio settings
- **Media Management**: View, edit, and delete images and videos
- **Real-time Progress**: Upload progress tracking for large files
- **Bulk Operations**: Multiple file uploads
- **Project Statistics**: View counts, media counts, and status

#### Key Functionality:
```typescript
// Create project with images
const handleCreateProject = async (formData: FormData) => {
  const formDataToSend = new FormData();
  formDataToSend.append('title', formData.title);
  formDataToSend.append('description', formData.description);
  formDataToSend.append('category', formData.category);
  formDataToSend.append('tags', JSON.stringify(formData.tags));
  formDataToSend.append('isPublished', formData.isPublished.toString());
  
  imageFiles.forEach(file => {
    formDataToSend.append('images', file);
  });

  await portfolioService.createProject(formDataToSend);
};

// Upload video with audio settings
const handleVideoUpload = async () => {
  await portfolioService.uploadProjectVideo(
    selectedProject.id,
    videoFile,
    {
      video_autoplay: false,
      video_muted: false, // Allow audio by default
      video_loop: false,
      order_index: 0
    }
  );
};
```

## 🎵 Audio Support Implementation

### Video Audio Configuration

The system supports full audio functionality for videos:

#### Audio Settings:
- **Default**: Audio is enabled (`video_muted: false`)
- **Autoplay**: When autoplay is enabled, videos are automatically muted to comply with browser policies
- **Manual Control**: Users can control volume and mute/unmute through video controls
- **Audio Quality**: Original audio quality is preserved during upload and compression

#### Audio Controls:
```typescript
// Enable audio for a video
const videoSettings = {
  video_autoplay: false,
  video_muted: false,  // Audio enabled
  video_loop: false,
  order_index: 0
};

// Disable audio for a video
const videoSettings = {
  video_autoplay: true,
  video_muted: true,   // Audio disabled
  video_loop: false,
  order_index: 0
};
```

#### Frontend Audio Implementation:
```typescript
const handleVolumeChange = (newVolume: number) => {
  setVolume(newVolume);
  setIsMuted(newVolume === 0);
  if (videoRef) {
    videoRef.volume = newVolume;
    videoRef.muted = newVolume === 0;
  }
};

const toggleMute = () => {
  const newMuted = !isMuted;
  setIsMuted(newMuted);
  if (videoRef) {
    videoRef.muted = newMuted;
  }
};
```

## 📱 User Interface Components

### 1. Media Gallery Features

#### Main Display:
- **Responsive Video Player**: Full-featured video player with controls
- **Image Display**: High-quality image display with zoom support
- **Smooth Transitions**: Framer Motion animations between media
- **Navigation Arrows**: Previous/next navigation buttons

#### Thumbnail Navigation:
- **Visual Thumbnails**: Small preview images for all media
- **Media Type Indicators**: Icons showing image/video type
- **Active State**: Highlighted active thumbnail
- **Hover Effects**: Play icons for video thumbnails

#### Audio Controls:
- **Volume Slider**: Adjustable volume control
- **Mute Button**: Quick mute/unmute toggle
- **Audio Status**: Visual indicators for audio state
- **Duration Display**: Video duration information

### 2. Admin Interface Features

#### Project Management:
- **Project Cards**: Visual project overview with thumbnails
- **Media Counts**: Display image and video counts
- **Status Indicators**: Published/draft status badges
- **Quick Actions**: Edit, delete, and publish buttons

#### Upload Interface:
- **Drag & Drop**: File upload with drag and drop support
- **Progress Tracking**: Real-time upload progress for large files
- **File Validation**: Client-side file type and size validation
- **Batch Upload**: Multiple file upload support

#### Media Settings:
- **Video Settings**: Autoplay, mute, loop, and order controls
- **Audio Configuration**: Audio enable/disable options
- **Poster Images**: Custom thumbnail images for videos
- **Order Management**: Control display order of media

## 🔄 API Integration

### Client Endpoints (Public)

```typescript
// Get all published projects with media
GET /api/portfolio/published?page=1&limit=10

// Get featured projects
GET /api/portfolio/featured?limit=6

// Get project by ID with all media
GET /api/portfolio/:projectId

// Get project videos
GET /api/portfolio/:projectId/videos

// Search projects
GET /api/portfolio/search?query=wedding&page=1&limit=10

// Get projects by tags
GET /api/portfolio/tags?tags=wedding,outdoor&page=1&limit=10
```

### Admin Endpoints (Authentication Required)

```typescript
// Create project with images
POST /api/portfolio/ (multipart/form-data)

// Upload single video to project
POST /api/portfolio/:projectId/videos (multipart/form-data)

// Bulk upload videos
POST /api/portfolio/:projectId/videos/bulk (multipart/form-data)

// Update video settings
PUT /api/portfolio/videos/:videoId

// Delete video
DELETE /api/portfolio/videos/:videoId

// Delete project image
DELETE /api/portfolio/:projectId/images/:imageId

// Toggle publish status
PATCH /api/portfolio/:projectId/publish

// Get all projects (admin)
GET /api/portfolio/admin/all?page=1&limit=10

// Get portfolio statistics
GET /api/portfolio/admin/stats
```

## 🚀 Usage Examples

### 1. Display Project with Media

```typescript
import PortfolioMediaGallery from '../components/portfolio/PortfolioMediaGallery';

const ProjectPage = ({ projectId }) => {
  const [project, setProject] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      const projectData = await portfolioService.getProject(projectId);
      setProject(projectData);
    };
    fetchProject();
  }, [projectId]);

  if (!project) return <div>Loading...</div>;

  return (
    <PortfolioMediaGallery 
      project={project}
      onMediaChange={(index) => console.log('Active media:', index)}
    />
  );
};
```

### 2. Upload Video with Audio

```typescript
const handleVideoUpload = async (projectId, videoFile) => {
  try {
    const video = await portfolioService.uploadProjectVideo(
      projectId,
      videoFile,
      {
        video_autoplay: false,
        video_muted: false, // Enable audio
        video_loop: false,
        order_index: 0
      }
    );
    console.log('Video uploaded with audio:', video);
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
```

### 3. Admin Project Management

```typescript
import PortfolioProjectManager from '../components/admin/PortfolioProjectManager';

const AdminPage = () => {
  return (
    <PortfolioProjectManager 
      onProjectUpdate={() => {
        // Refresh data or show notifications
        console.log('Project updated');
      }}
    />
  );
};
```

## 🎨 Styling and Theming

### CSS Classes

The system uses Tailwind CSS classes for styling:

```css
/* Media Gallery */
.portfolio-media-gallery {
  @apply space-y-6;
}

/* Video Controls */
.video-controls {
  @apply absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-3;
}

/* Thumbnail Navigation */
.media-thumbnails {
  @apply flex gap-2 overflow-x-auto pb-2;
}

.thumbnail {
  @apply flex-shrink-0 relative group w-20 h-20 rounded-lg overflow-hidden;
}

.thumbnail.active {
  @apply ring-2 ring-blue-500;
}
```

### Dark Mode Support

All components support dark mode with appropriate color schemes:

```css
/* Dark mode variants */
.bg-white.dark:bg-gray-800
.text-gray-900.dark:text-white
.border-gray-200.dark:border-gray-700
```

## 🔧 Configuration

### Environment Variables

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3001/api

# Upload Configuration
VITE_MAX_VIDEO_SIZE=500000000  # 500MB
VITE_MAX_IMAGE_SIZE=50000000   # 50MB
```

### Vite Configuration

Update `vite.config.ts` to support large file uploads:

```typescript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        timeout: 1800000, // 30 minutes for large uploads
      },
    },
  },
});
```

## 🧪 Testing

### Component Testing

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import PortfolioMediaGallery from '../components/portfolio/PortfolioMediaGallery';

test('displays project media correctly', () => {
  const mockProject = {
    id: '1',
    title: 'Test Project',
    images: [{ id: '1', image_url: 'test.jpg', thumbnail_url: 'thumb.jpg' }],
    videos: [{ id: '1', video_url: 'test.mp4', video_thumbnail_url: 'thumb.jpg' }]
  };

  render(<PortfolioMediaGallery project={mockProject} />);
  
  expect(screen.getByText('Test Project')).toBeInTheDocument();
  expect(screen.getByAltText('Portfolio image')).toBeInTheDocument();
});
```

### API Testing

```typescript
import portfolioService from '../services/portfolioService';

test('uploads video with audio settings', async () => {
  const mockFile = new File(['test'], 'test.mp4', { type: 'video/mp4' });
  
  const result = await portfolioService.uploadProjectVideo(
    'project-id',
    mockFile,
    { video_muted: false, video_autoplay: false, video_loop: false, order_index: 0 }
  );
  
  expect(result.video).toBeDefined();
  expect(result.video.video_muted).toBe(false);
});
```

## 📈 Performance Optimization

### 1. Lazy Loading

```typescript
// Lazy load media components
const PortfolioMediaGallery = lazy(() => import('../components/portfolio/PortfolioMediaGallery'));
const PortfolioProjectManager = lazy(() => import('../components/admin/PortfolioProjectManager'));
```

### 2. Image Optimization

```typescript
// Use thumbnails for faster loading
<img 
  src={image.thumbnail_url} 
  alt="Thumbnail"
  loading="lazy"
  className="w-full h-full object-cover"
/>
```

### 3. Video Optimization

```typescript
// Preload video metadata only
<video
  preload="metadata"
  poster={video.video_poster || video.video_thumbnail_url}
  className="w-full h-full object-cover"
>
  <source src={video.video_url} type="video/mp4" />
</video>
```

## 🔒 Security Considerations

### 1. File Validation

```typescript
const validateVideoFile = (file: File) => {
  const allowedTypes = ['video/mp4', 'video/mov', 'video/avi'];
  const maxSize = 500 * 1024 * 1024; // 500MB
  
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Please use MP4, MOV, or AVI.');
  }
  
  if (file.size > maxSize) {
    throw new Error('File too large. Maximum size is 500MB.');
  }
};
```

### 2. Authentication

```typescript
// Admin endpoints require authentication
const adminApi = axios.create({
  baseURL: API_BASE,
});

adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## 🚀 Deployment

### 1. Build Configuration

```bash
# Build the application
npm run build

# The build includes all media components and optimizations
```

### 2. Environment Setup

```bash
# Production environment variables
VITE_API_BASE_URL=https://your-api-domain.com/api
VITE_MAX_VIDEO_SIZE=500000000
VITE_MAX_IMAGE_SIZE=50000000
```

### 3. CDN Configuration

For optimal media delivery, configure your CDN to handle:
- Image optimization and compression
- Video streaming and adaptive bitrate
- Audio quality preservation
- Caching strategies for media files

## 📚 Additional Resources

### Documentation
- [API Documentation](./API_DOCUMENTATION.md)
- [Component Library](./COMPONENT_LIBRARY.md)
- [Deployment Guide](./DEPLOYMENT_GUIDE.md)

### Examples
- [Portfolio Gallery Demo](./examples/portfolio-gallery.md)
- [Admin Management Demo](./examples/admin-management.md)
- [Audio Controls Demo](./examples/audio-controls.md)

### Troubleshooting
- [Common Issues](./troubleshooting/common-issues.md)
- [Performance Tips](./troubleshooting/performance-tips.md)
- [Audio Configuration](./troubleshooting/audio-configuration.md)

---

## ✅ Implementation Checklist

- [x] Enhanced TypeScript interfaces for media types
- [x] Comprehensive portfolio service with all API endpoints
- [x] Portfolio media gallery component with audio support
- [x] Admin portfolio project manager
- [x] Real-time upload progress tracking
- [x] Audio controls and settings
- [x] Responsive design and mobile support
- [x] Dark mode support
- [x] Error handling and validation
- [x] Performance optimizations
- [x] Security considerations
- [x] Documentation and examples

The portfolio media system is now fully implemented and ready for production use, providing a comprehensive multimedia experience for showcasing photography and videography work with professional-grade features and user-friendly interfaces. 