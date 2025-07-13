import { toast } from 'react-hot-toast';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export const showNotification = (message: string, type: NotificationType = 'info') => {
  try {
    switch (type) {
      case 'success':
        toast.success(message, {
          duration: 4000,
          position: 'top-right',
          style: {
            background: '#10B981',
            color: '#fff',
          },
        });
        break;
      case 'error':
        toast.error(message, {
          duration: 6000,
          position: 'top-right',
          style: {
            background: '#EF4444',
            color: '#fff',
          },
        });
        break;
      case 'warning':
        toast(message, {
          duration: 5000,
          position: 'top-right',
          icon: '⚠️',
          style: {
            background: '#F59E0B',
            color: '#fff',
          },
        });
        break;
      case 'info':
      default:
        toast(message, {
          duration: 4000,
          position: 'top-right',
          style: {
            background: '#3B82F6',
            color: '#fff',
          },
        });
        break;
    }
  } catch (error) {
    // Fallback to console if toast is not available
    console.log(`[${type.toUpperCase()}] ${message}`);
    
    // Fallback to browser alert for errors
    if (type === 'error') {
      alert(`Error: ${message}`);
    }
  }
};

export const showSuccessNotification = (message: string) => {
  showNotification(message, 'success');
};

export const showErrorNotification = (message: string) => {
  showNotification(message, 'error');
};

export const showWarningNotification = (message: string) => {
  showNotification(message, 'warning');
};

export const showInfoNotification = (message: string) => {
  showNotification(message, 'info');
}; 