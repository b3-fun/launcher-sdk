export interface SDKConfig {
  releaseType: "embedded" | "external";
  debug?: boolean;
  overwriteJwt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface ChannelStatus {
  exists: boolean;
  present: boolean;
  wallet: string;
  openedAt: number;
}

export interface NotificationResult {
  success: boolean;
}

export interface UserActivity {
  type: string;
  eventId: string;
  gameId: string;
  gameName: string;
  gameSlug: string;
  user: {
    id: string;
    address: string;
    username: string;
  };
  displayText: string;
  timestamp: number;
}

export interface CustomActivityResult {
  success: boolean;
  activity: {
    _id: string;
    label: string;
    normalizedAddress: string;
    timestamp: number;
    eventId: string;
    gameId: string;
  };
}

export interface State<T> {
  _id: string;
  gameId: string;
  ipfsHash: string;
  normalizedAddress: string;
  label: string;
  updatedAt: number;
  state?: T;
}

export interface LeaderboardEntry {
  _id: string;
  nonce: string;
  gameId: string;
  normalizedAddress: string;
  score: number;
  updatedAt: number;
  username: string;
  avatar: string;
}

export interface MessageChannel {
  _id: string;
  name: string;
  chatPicture: string;
  createdAt: number;
  updatedAt: number;
  participants: {
    wallet: string;
    userGroup: number;
    permissions: string[];
  }[];
  gameId: string;
}

export interface ChannelMessage {
  _id: string;
  channelId: string;
  senderId: string;
  content: string;
  createdAt: number;
  updatedAt?: number;
} 