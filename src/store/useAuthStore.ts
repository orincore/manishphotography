import { create } from 'zustand';
import authService, { LoginData, RegisterData, UserProfile } from '../services/authService';

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  
  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const loginData: LoginData = { email, password };
      const response = await authService.login(loginData);
      
      // Store token
      authService.setToken(response.token);
      
      set({ 
        user: response.user, 
        isAuthenticated: true, 
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'An error occurred during login', 
        isLoading: false 
      });
    }
  },
  
  register: async (userData: RegisterData) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await authService.register(userData);
      
      // Store token
      authService.setToken(response.token);
      
      set({ 
        user: response.user, 
        isAuthenticated: true, 
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'An error occurred during registration', 
        isLoading: false 
      });
    }
  },
  
  logout: () => {
    authService.removeToken();
    set({ 
      user: null, 
      isAuthenticated: false 
    });
  },

  checkAuth: async () => {
    if (!authService.isAuthenticated()) {
      return;
    }

    set({ isLoading: true });
    
    try {
      const user = await authService.getProfile();
      set({ 
        user, 
        isAuthenticated: true, 
        isLoading: false 
      });
    } catch (error: any) {
      authService.removeToken();
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false 
      });
    }
  },
}));