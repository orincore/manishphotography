import { toast } from 'react-hot-toast';

// Fallback notification system
const fallbackNotify = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
  const prefix = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
  console.log(`${prefix} ${message}`);
  
  // Also show a browser alert for important messages
  if (type === 'error') {
    alert(`Error: ${message}`);
  }
};

// Safe toast wrapper
export const notify = {
  success: (message: string) => {
    try {
      toast.success(message);
    } catch (error) {
      fallbackNotify(message, 'success');
    }
  },
  
  error: (message: string) => {
    try {
      toast.error(message);
    } catch (error) {
      fallbackNotify(message, 'error');
    }
  },
  
  info: (message: string) => {
    try {
      toast(message);
    } catch (error) {
      fallbackNotify(message, 'info');
    }
  },
  
  loading: (message: string) => {
    try {
      return toast.loading(message);
    } catch (error) {
      fallbackNotify(message, 'info');
      return null;
    }
  }
};

export default notify; 