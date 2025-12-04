export interface User {
  id: string;
  email?: string;
  displayName: string;
  role: 'seeker' | 'listener' | 'admin';
  isVerified?: boolean;
  credentials?: string;
  bio?: string;
  isAnonymous: boolean;
  createdAt: Date;
}

export interface Session {
  id: string;
  seekerId: string;
  listenerId: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  startTime: Date;
  endTime?: Date;
  messages: Message[];
}

export interface Message {
  id: string;
  sessionId: string;
  senderId: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'system';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface ChatState {
  activeSession: Session | null;
  messages: Message[];
  isConnected: boolean;
}

export interface ListenerProfile {
  id: string;
  displayName: string;
  bio: string;
  specializations: string[];
  rating: number;
  totalSessions: number;
  isOnline: boolean;
  credentials: {
    type: string;
    institution: string;
    verified: boolean;
  };
}