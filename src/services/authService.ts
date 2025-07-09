import api from './api';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
}

class AuthService {
  // Register new user
  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', userData);
    return response.data;
  }

  // Login user
  async login(credentials: LoginData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  }

  // Get user profile
  async getProfile(): Promise<UserProfile> {
    const response = await api.get('/auth/profile');
    // The API returns { user: { ... } }
    return response.data.user;
  }

  // Update user profile
  async updateProfile(profileData: Partial<UserProfile>): Promise<UserProfile> {
    const response = await api.put<UserProfile>('/auth/profile', profileData);
    return response.data;
  }

  // Setup initial admin (only for first admin)
  async setupAdmin(adminData: RegisterData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/admin/setup', adminData);
    return response.data;
  }

  // Store token in localStorage
  setToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  // Get token from localStorage
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Remove token from localStorage
  removeToken(): void {
    localStorage.removeItem('authToken');
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export default new AuthService(); 