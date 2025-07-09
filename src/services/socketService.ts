import { io, Socket } from 'socket.io-client';

export interface UploadProgress {
  uploadId: string;
  status: 'starting' | 'compressing' | 'uploading' | 'completed' | 'error';
  progress: number;
  message: string;
  element?: any;
}

export interface SocketService {
  connect(): void;
  disconnect(): void;
  joinUpload(uploadId: string): void;
  leaveUpload(uploadId: string): void;
  onUploadProgress(callback: (progress: UploadProgress) => void): void;
  offUploadProgress(callback: (progress: UploadProgress) => void): void;
  onConnect(callback: () => void): void;
  onDisconnect(callback: () => void): void;
  isConnected(): boolean;
}

class SocketIOService implements SocketService {
  private socket: Socket | null = null;
  private uploadProgressCallbacks: ((progress: UploadProgress) => void)[] = [];
  private connectCallbacks: (() => void)[] = [];
  private disconnectCallbacks: (() => void)[] = [];

  connect(): void {
    if (this.socket?.connected) {
      console.log('Socket already connected');
      return;
    }

    try {
      // Connect to the backend Socket.IO server
      this.socket = io(import.meta.env.VITE_API_URL || 'http://localhost:3000', {
        transports: ['websocket', 'polling'],
        timeout: 20000,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      this.socket.on('connect', () => {
        console.log('Socket.IO connected:', this.socket?.id);
        this.connectCallbacks.forEach(callback => callback());
      });

      this.socket.on('disconnect', (reason) => {
        console.log('Socket.IO disconnected:', reason);
        this.disconnectCallbacks.forEach(callback => callback());
      });

      this.socket.on('connect_error', (error) => {
        console.error('Socket.IO connection error:', error);
      });

      this.socket.on('upload-progress', (progress: UploadProgress) => {
        console.log('Upload progress received:', progress);
        this.uploadProgressCallbacks.forEach(callback => callback(progress));
      });

    } catch (error) {
      console.error('Failed to initialize Socket.IO:', error);
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinUpload(uploadId: string): void {
    if (!uploadId) {
      console.warn('No upload ID provided, skipping room join');
      return;
    }
    
    if (this.socket?.connected) {
      this.socket.emit('join-upload', uploadId);
      console.log('Joined upload room:', uploadId);
    } else {
      console.warn('Socket not connected, cannot join upload room');
      // For temporary upload IDs, we'll still track them locally
      if (uploadId.startsWith('temp_')) {
        console.log('Tracking temporary upload ID locally:', uploadId);
      }
    }
  }

  leaveUpload(uploadId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('leave-upload', uploadId);
      console.log('Left upload room:', uploadId);
    }
  }

  onUploadProgress(callback: (progress: UploadProgress) => void): void {
    this.uploadProgressCallbacks.push(callback);
  }

  offUploadProgress(callback: (progress: UploadProgress) => void): void {
    const index = this.uploadProgressCallbacks.indexOf(callback);
    if (index > -1) {
      this.uploadProgressCallbacks.splice(index, 1);
    }
  }

  onConnect(callback: () => void): void {
    this.connectCallbacks.push(callback);
  }

  onDisconnect(callback: () => void): void {
    this.disconnectCallbacks.push(callback);
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

// Create singleton instance
const socketService = new SocketIOService();

export default socketService; 