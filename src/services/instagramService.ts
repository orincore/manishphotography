import api from './api';

export interface InstagramProfile {
  id: string;
  username: string;
  fullName: string;
  profilePicture: string;
  bio?: string;
  website?: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
}

export interface InstagramPost {
  id: string;
  caption?: string;
  mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  mediaUrl: string;
  thumbnailUrl?: string;
  permalink: string;
  timestamp: string;
  likeCount: number;
  commentCount: number;
  tags?: string[];
}

export interface InstagramStory {
  id: string;
  mediaType: 'IMAGE' | 'VIDEO';
  mediaUrl: string;
  permalink: string;
  timestamp: string;
  expiresAt: string;
}

export interface InstagramInsights {
  impressions: number;
  reach: number;
  engagement: number;
  saved: number;
  videoViews?: number;
  videoPlayCount?: number;
}

export interface HomepageFeed {
  posts: InstagramPost[];
  stories: InstagramStory[];
  profile: InstagramProfile;
}

class InstagramService {
  // Get Instagram profile
  async getProfile(): Promise<InstagramProfile> {
    const response = await api.get<InstagramProfile>('/instagram/profile');
    return response.data;
  }

  // Get Instagram posts
  async getPosts(limit?: number): Promise<InstagramPost[]> {
    const response = await api.get<InstagramPost[]>('/instagram/posts', {
      params: { limit },
    });
    return response.data;
  }

  // Get homepage feed (posts + stories + profile)
  async getHomepageFeed(): Promise<HomepageFeed> {
    const response = await api.get<HomepageFeed>('/instagram/homepage');
    return response.data;
  }

  // Get Instagram stories
  async getStories(): Promise<InstagramStory[]> {
    const response = await api.get<InstagramStory[]>('/instagram/stories');
    return response.data;
  }

  // Get specific post details
  async getPost(postId: string): Promise<InstagramPost> {
    const response = await api.get<InstagramPost>(`/instagram/post/${postId}`);
    return response.data;
  }

  // Admin: Get post insights
  async getPostInsights(postId: string): Promise<InstagramInsights> {
    const response = await api.get<InstagramInsights>(`/instagram/post/${postId}/insights`);
    return response.data;
  }
}

export default new InstagramService(); 