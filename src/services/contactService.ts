import api from './api';

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  message: string;
  is_read: boolean;
  status: 'pending' | 'resolved' | 'waste';
  created_at: string;
  updated_at: string;
  package?: string; // Added for package selection
  package_id?: string; // Added for package_id field
}

export interface CreateContactData {
  name: string;
  email: string;
  phone?: string;
  location?: string;
  message: string;
  package?: string; // legacy, for backward compatibility
  package_id?: string; // for new API, uuid
}

export interface ContactStats {
  totalContacts: number;
  readContacts: number;
  unreadContacts: number;
  pendingContacts: number;
  resolvedContacts: number;
  wasteContacts: number;
  monthlyStats: Record<string, number>;
}

export interface ContactFilters {
  page?: number;
  limit?: number;
  status?: 'pending' | 'resolved' | 'waste';
  readStatus?: 'read' | 'unread';
}

export interface ContactPagination {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

export interface ContactSearchParams {
  query: string;
  page?: number;
  limit?: number;
}

export interface BulkActionData {
  contactIds: string[];
}

class ContactService {
  // Submit contact form
  async submitContact(contactData: CreateContactData): Promise<{ message: string; contact: ContactSubmission }> {
    // Create payload with all fields from contactData
    const packageValue = contactData.package_id || contactData.package || '';
    const payload = { 
      name: contactData.name,
      email: contactData.email,
      message: contactData.message,
      ...(contactData.phone && { phone: contactData.phone }),
      ...(contactData.location && { location: contactData.location }),
      package_id: packageValue, // Send as 'package_id'
      package: packageValue // Also send as 'package' for compatibility
    };
    
    // Debug: Log the payload being sent
    console.log('Contact form payload:', payload);
    console.log('Package value being sent:', packageValue);
    console.log('Package value type:', typeof packageValue);
    
    const response = await api.post<{ message: string; contact: ContactSubmission }>('/contact', payload);
    
    // Debug: Log the response
    console.log('Contact API response:', response.data);
    
    return response.data;
  }

  // Admin: Get all contact submissions with filtering
  async getAllContacts(filters: ContactFilters = {}): Promise<{
    message: string;
    contacts: ContactSubmission[];
    pagination: ContactPagination;
  }> {
    const params = new URLSearchParams();
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.status) params.append('status', filters.status);
    if (filters.readStatus) params.append('readStatus', filters.readStatus);

    const response = await api.get<{
      message: string;
      contacts: ContactSubmission[];
      pagination: ContactPagination;
    }>('/contact/admin/all', { params });
    return response.data;
  }

  // Admin: Get contact statistics
  async getContactStats(): Promise<{ message: string; stats: ContactStats }> {
    const response = await api.get<{ message: string; stats: ContactStats }>('/contact/admin/stats');
    return response.data;
  }

  // Admin: Mark contact as read
  async markAsRead(contactId: string): Promise<{ message: string; contact: ContactSubmission }> {
    const response = await api.patch<{ message: string; contact: ContactSubmission }>(`/contact/admin/${contactId}/read`);
    return response.data;
  }

  // Admin: Mark contact as unread
  async markAsUnread(contactId: string): Promise<{ message: string; contact: ContactSubmission }> {
    const response = await api.patch<{ message: string; contact: ContactSubmission }>(`/contact/admin/${contactId}/unread`);
    return response.data;
  }

  // Admin: Mark contact as resolved
  async markAsResolved(contactId: string): Promise<{ message: string; contact: ContactSubmission }> {
    const response = await api.patch<{ message: string; contact: ContactSubmission }>(`/contact/admin/${contactId}/resolved`);
    return response.data;
  }

  // Admin: Mark contact as waste
  async markAsWaste(contactId: string): Promise<{ message: string; contact: ContactSubmission }> {
    const response = await api.patch<{ message: string; contact: ContactSubmission }>(`/contact/admin/${contactId}/waste`);
    return response.data;
  }

  // Admin: Delete contact submission
  async deleteContact(contactId: string): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/contact/admin/${contactId}`);
    return response.data;
  }

  // Admin: Search contacts
  async searchContacts(params: ContactSearchParams): Promise<{
    message: string;
    contacts: ContactSubmission[];
    pagination: ContactPagination;
  }> {
    const queryParams = new URLSearchParams();
    queryParams.append('query', params.query);
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());

    const response = await api.get<{
      message: string;
      contacts: ContactSubmission[];
      pagination: ContactPagination;
    }>('/contact/admin/search', { params: queryParams });
    return response.data;
  }

  // Admin: Get contacts by email
  async getContactsByEmail(email: string, page = 1, limit = 10): Promise<{
    message: string;
    contacts: ContactSubmission[];
    pagination: ContactPagination;
  }> {
    const response = await api.get<{
      message: string;
      contacts: ContactSubmission[];
      pagination: ContactPagination;
    }>(`/contact/admin/email/${email}?page=${page}&limit=${limit}`);
    return response.data;
  }

  // Admin: Get unread count
  async getUnreadCount(): Promise<{ message: string; count: number }> {
    const response = await api.get<{ message: string; count: number }>('/contact/admin/unread-count');
    return response.data;
  }

  // Admin: Bulk mark as read
  async bulkMarkAsRead(bulkData: BulkActionData): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>('/contact/admin/bulk/read', bulkData);
    return response.data;
  }

  // Admin: Bulk mark as resolved
  async bulkMarkAsResolved(bulkData: BulkActionData): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>('/contact/admin/bulk/resolved', bulkData);
    return response.data;
  }

  // Admin: Bulk mark as waste
  async bulkMarkAsWaste(bulkData: BulkActionData): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>('/contact/admin/bulk/waste', bulkData);
    return response.data;
  }

  // Admin: Bulk delete contacts
  async bulkDeleteContacts(bulkData: BulkActionData): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>('/contact/admin/bulk/delete', bulkData);
    return response.data;
  }
}

export default new ContactService(); 