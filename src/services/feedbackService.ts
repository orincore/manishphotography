import api from './api';

export interface Feedback {
  id: string;
  projectId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  approved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFeedbackData {
  projectId: string;
  rating: number;
  comment: string;
}

export interface UpdateFeedbackData {
  rating?: number;
  comment?: string;
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
  averageRating: number;
  recentFeedback: Feedback[];
}

export interface BulkModerateData {
  feedbackIds: string[];
  approved: boolean;
}

// --- Add/Update interfaces for moderation and admin ---
export interface ModerateFeedbackData {
  isApproved: boolean;
  isHidden: boolean;
}

export interface BulkModerateFeedbackData {
  feedbackIds: string[];
  isApproved: boolean;
  isHidden: boolean;
}

class FeedbackService {
  // Submit new feedback (User)
  async submitFeedback(feedbackData: CreateFeedbackData): Promise<Feedback> {
    try {
      const response = await api.post<Feedback>("/feedback/", feedbackData);
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

  // Get all feedback (Admin)
  async getAllFeedbackAdmin(page = 1, limit = 10): Promise<{ feedback: Feedback[]; total: number }> {
    const response = await api.get<{ feedback: Feedback[]; total: number }>(`/feedback/admin/all?page=${page}&limit=${limit}`);
    return response.data;
  }

  // Get user's own feedback
  async getUserFeedback(): Promise<Feedback[]> {
    const response = await api.get<Feedback[]>("/feedback/user/me");
    return response.data;
  }

  // Update feedback (Admin)
  async updateFeedbackAdmin(feedbackId: string, data: UpdateFeedbackData): Promise<Feedback> {
    const response = await api.put<Feedback>(`/feedback/${feedbackId}`, data);
    return response.data;
  }

  // Update own feedback (User)
  async updateOwnFeedback(feedbackId: string, data: UpdateFeedbackData): Promise<Feedback> {
    const response = await api.put<Feedback>(`/feedback/${feedbackId}/user`, data);
    return response.data;
  }

  // Delete feedback (Admin)
  async deleteFeedbackAdmin(feedbackId: string): Promise<void> {
    await api.delete(`/feedback/${feedbackId}`);
  }

  // Delete own feedback (User)
  async deleteOwnFeedback(feedbackId: string): Promise<void> {
    await api.delete(`/feedback/${feedbackId}/user`);
  }

  // Moderate feedback (Admin)
  async moderateFeedback(feedbackId: string, data: ModerateFeedbackData): Promise<Feedback> {
    const response = await api.patch<Feedback>(`/feedback/${feedbackId}/moderate`, data);
    return response.data;
  }

  // Bulk moderate feedback (Admin)
  async bulkModerateFeedback(data: BulkModerateFeedbackData): Promise<void> {
    await api.post("/feedback/bulk/moderate", data);
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