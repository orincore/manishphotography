import { create } from 'zustand';
import { users } from '../data/users';
import { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Omit<User, 'id' | 'role' | 'createdAt'>) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  
  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user = users.find(u => u.email === email);
      
      if (user && password === 'password') { // Mock password check
        set({ 
          user, 
          isAuthenticated: true, 
          isLoading: false 
        });
      } else {
        set({ 
          error: 'Invalid email or password', 
          isLoading: false 
        });
      }
    } catch (error) {
      set({ 
        error: 'An error occurred during login', 
        isLoading: false 
      });
    }
  },
  
  register: async (userData) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const existingUser = users.find(u => u.email === userData.email);
      
      if (existingUser) {
        set({ 
          error: 'User with this email already exists', 
          isLoading: false 
        });
        return;
      }
      
      const newUser: User = {
        ...userData,
        id: `${users.length + 1}`,
        role: 'user',
        createdAt: new Date().toISOString(),
      };
      
      // In a real app, we would add the user to the database
      // For now, just set the user as logged in
      set({ 
        user: newUser, 
        isAuthenticated: true, 
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: 'An error occurred during registration', 
        isLoading: false 
      });
    }
  },
  
  logout: () => {
    set({ 
      user: null, 
      isAuthenticated: false 
    });
  },
}));