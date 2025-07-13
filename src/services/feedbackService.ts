import api from './api';

export interface Feedback {
  id: string;
  user_id: string;
  project_id: string;
  rating: number;
  comment: string;
  is_approved: boolean;
  is_hidden: boolean;
  created_at: string;
  updated_at: string;
  users?: {
    name: string;
    email: string;
  };
  portfolio_projects?: {
    title: string;
    category: string;
  };
}

export interface CreateFeedbackData {
  rating: number;
  comment: string;
}

export interface UpdateFeedbackData {
  rating?: number;
  comment?: string;
  is_approved?: boolean;
  is_hidden?: boolean;
}

export interface FeedbackSummary {
  totalFeedback: number;
  averageRating: number;
  approvedFeedback: number;
  pendingFeedback: number;
}

export interface FeedbackStats {
  totalFeedback: number;
  approvedFeedback: number;
  pendingFeedback: number;
  hiddenFeedback: number;
  lowRatingFeedback: number;
  averageRating: number;
  ratingDistribution: {
    [key: number]: number;
  };
}

export interface FeedbackFilters {
  page?: number;
  limit?: number;
  status?: 'approved' | 'pending' | 'hidden';
  rating?: number;
  projectId?: string;
}

export interface FeedbackPagination {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

export interface ModerateFeedbackData {
  isApproved: boolean;
  isHidden: boolean;
}

export interface BulkModerateFeedbackData {
  feedbackIds: string[];
  isApproved: boolean;
  isHidden: boolean;
}

export interface BulkModerateResult {
  feedbackId: string;
  success: boolean;
  message: string;
}

class FeedbackService {
  // Submit new feedback (User)
  async submitFeedback(feedbackData: CreateFeedbackData): Promise<Feedback> {
    try {
      const response = await api.post<Feedback>("/feedback", feedbackData);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 400) {
        throw new Error("You have already submitted feedback. You can edit or delete your existing feedback. If you want, you can edit your existing feedback.");
      }
      throw error;
    }
  }

  // Get feedback for a project (role-based visibility)
  async getFeedbackByProject(projectId: string): Promise<Feedback[]> {
    const response = await api.get<Feedback[]>(`/feedback/project/${projectId}`);
    return response.data;
  }

  // Get all feedback (Admin) with filtering
  async getAllFeedbackAdmin(filters: FeedbackFilters = {}): Promise<{
    message: string;
    feedback: Feedback[];
    pagination: FeedbackPagination;
  }> {
    const params = new URLSearchParams();
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.status) params.append('status', filters.status);
    if (filters.rating) params.append('rating', filters.rating.toString());
    if (filters.projectId) params.append('projectId', filters.projectId);

    const response = await api.get<{
      message: string;
      feedback: Feedback[];
      pagination: FeedbackPagination;
    }>(`/feedback/admin/all?${params.toString()}`);
    return response.data;
  }

  // Get feedback statistics (Admin)
  async getFeedbackStatsAdmin(): Promise<{
    message: string;
    stats: FeedbackStats;
  }> {
    const response = await api.get<{
      message: string;
      stats: FeedbackStats;
    }>('/feedback/admin/stats/detailed');
    return response.data;
  }

  // Get user's own feedback
  async getUserFeedback(): Promise<Feedback[]> {
    const response = await api.get<Feedback[]>("/feedback/user/me");
    return response.data;
  }

  // Update feedback (Admin)
  async updateFeedbackAdmin(feedbackId: string, data: UpdateFeedbackData): Promise<{
    message: string;
    feedback: Feedback;
  }> {
    const response = await api.put<{
      message: string;
      feedback: Feedback;
    }>(`/feedback/${feedbackId}`, data);
    return response.data;
  }

  // Update own feedback (User)
  async updateOwnFeedback(feedbackId: string, data: UpdateFeedbackData): Promise<Feedback> {
    const response = await api.put<Feedback>(`/feedback/${feedbackId}/user`, data);
    return response.data;
  }

  // Delete feedback (Admin)
  async deleteFeedbackAdmin(feedbackId: string): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/feedback/${feedbackId}`);
    return response.data;
  }

  // Delete own feedback (User)
  async deleteOwnFeedback(feedbackId: string): Promise<void> {
    await api.delete(`/feedback/${feedbackId}/user`);
  }

  // Moderate feedback (Admin)
  async moderateFeedback(feedbackId: string, data: ModerateFeedbackData): Promise<{
    message: string;
    feedback: Feedback;
  }> {
    const response = await api.patch<{
      message: string;
      feedback: Feedback;
    }>(`/feedback/${feedbackId}/moderate`, data);
    return response.data;
  }

  // Bulk moderate feedback (Admin)
  async bulkModerateFeedback(data: BulkModerateFeedbackData): Promise<{
    message: string;
    results: BulkModerateResult[];
  }> {
    const response = await api.post<{
      message: string;
      results: BulkModerateResult[];
    }>("/feedback/bulk/moderate", data);
    return response.data;
  }

  // Get feedback summary (Public)
  async getFeedbackSummary(): Promise<FeedbackSummary> {
    const response = await api.get<FeedbackSummary>("/feedback/summary");
    return response.data;
  }

  // Get approved feedback (Public)
  async getApprovedFeedback(): Promise<{ message: string; feedback: any[]; pagination: any }> {
    const response = await api.get<{ message: string; feedback: any[]; pagination: any }>("/feedback/approved");
    return response.data;
  }
}

export default new FeedbackService(); 