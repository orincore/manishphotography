import api from './api';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateContactData {
  name: string;
  email: string;
  message: string;
}

export interface ContactStats {
  totalMessages: number;
  unreadMessages: number;
  readMessages: number;
  recentMessages: ContactMessage[];
}

export interface ContactSearchParams {
  query?: string;
  read?: boolean;
  page?: number;
  limit?: number;
}

export interface BulkActionData {
  contactIds: string[];
}

class ContactService {
  // Submit contact form
  async submitContact(contactData: CreateContactData): Promise<ContactMessage> {
    const response = await api.post<ContactMessage>('/contact', contactData);
    return response.data;
  }

  // Admin: Get all contact messages
  async getAllContacts(params?: ContactSearchParams): Promise<ContactMessage[]> {
    const response = await api.get<ContactMessage[]>('/contact/admin/all', { params });
    return response.data;
  }

  // Admin: Get contact statistics
  async getContactStats(): Promise<ContactStats> {
    const response = await api.get<ContactStats>('/contact/admin/stats');
    return response.data;
  }

  // Admin: Mark contact as read
  async markAsRead(contactId: string): Promise<ContactMessage> {
    const response = await api.patch<ContactMessage>(`/contact/admin/${contactId}/read`);
    return response.data;
  }

  // Admin: Mark contact as unread
  async markAsUnread(contactId: string): Promise<ContactMessage> {
    const response = await api.patch<ContactMessage>(`/contact/admin/${contactId}/unread`);
    return response.data;
  }

  // Admin: Delete contact message
  async deleteContact(contactId: string): Promise<void> {
    await api.delete(`/contact/admin/${contactId}`);
  }

  // Admin: Bulk mark as read
  async bulkMarkAsRead(bulkData: BulkActionData): Promise<void> {
    await api.post('/contact/admin/bulk/read', bulkData);
  }

  // Admin: Bulk delete contacts
  async bulkDeleteContacts(bulkData: BulkActionData): Promise<void> {
    await api.post('/contact/admin/bulk/delete', bulkData);
  }

  // Admin: Export contacts
  async exportContacts(): Promise<Blob> {
    const response = await api.get('/contact/admin/export', {
      responseType: 'blob',
    });
    return response.data;
  }

  // Admin: Search contacts
  async searchContacts(query: string): Promise<ContactMessage[]> {
    const response = await api.get<ContactMessage[]>('/contact/admin/search', {
      params: { query },
    });
    return response.data;
  }
}

export default new ContactService(); 