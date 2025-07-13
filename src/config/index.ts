// Centralized configuration for the application
export const config = {
  // API Configuration
  api: {
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
    timeout: 1800000, // 30 minutes for video uploads
  },
  
  // Socket.IO Configuration
  socket: {
    url: import.meta.env.VITE_API_URL || 'http://localhost:3000',
    options: {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    },
  },
  
  // App Configuration
  app: {
    name: 'Manish Photography',
    version: '1.0.0',
  },
  
  // Feature Flags
  features: {
    realTimeProgress: true,
    videoCompression: true,
    adminPanel: true,
  },
};

export default config; 