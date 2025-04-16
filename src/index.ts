import { ApiClient } from './api-client';
import {
  SDKConfig,
  ApiResponse,
  ChannelStatus,
  NotificationResult,
  UserActivity,
  CustomActivityResult,
  LeaderboardEntry,
  MessageChannel,
  ChannelMessage,
  State
} from './types';

/**
 * B3 Web SDK for integrating with web applications and games
 */
export class B3WebSDK {
  private apiClient: ApiClient;
  private jwt: string;
  private releaseType: SDKConfig["releaseType"];

  /**
   * Initialize the SDK with the provided configuration
   */
  constructor(config: SDKConfig) {
    this.apiClient = new ApiClient(config);
    this.jwt = this.getJwtAndSetupSession(config);
    this.releaseType = config.releaseType;
  }

  /**
   * Returns the JWT token
   */
  public getJwt(): string {
    return this.jwt;
  }

  private getJwtAndSetupSession(config: SDKConfig) : string {
    let res : string | null = null;
    if (config.overwriteJwt) {
      res = config.overwriteJwt;
    } else if (["embedded", "external"].includes(this.releaseType)) {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      if (!token) throw new Error("Token not found in URL parameters.");
      res = token;
    } else {
      throw new Error("Release type not supported.");
    }

    if (this.releaseType == "external") {
      this.setHeartbeatInterval();
    }
    
    return res;
  }

  private setHeartbeatInterval(){
    setInterval(() => {
      this.channelHeartbeat();
    }, 1000 * 60 );
  }


  /**
   * Get channel status for a user
   */
  async getChannelStatus(): Promise<ApiResponse<ChannelStatus>> {
    return this.apiClient.post<ChannelStatus>('/launcher/', "channelStatus", { 
      launcherJwt: this.getJwt() 
    });
  }

  /**
   * Send a notification to a user
   */
  async sendNotification(message: string, type: "success" | "error"): Promise<ApiResponse<NotificationResult>> {
    return this.apiClient.post<NotificationResult>('/launcher/', "sendNotification", {
      launcherJwt: this.getJwt(),
      message,
      type
    });
  }

  /**
   * Get user activities
   */
  async getUserActivities(walletAddress: string, type: string, pageSize: number, pageNumber: number): Promise<ApiResponse<UserActivity[]>> {
    return this.apiClient.get<UserActivity[]>(`/activities?pageSize=${pageSize}&pageNumber=${pageNumber}&walletAddress=${walletAddress}&type=${type}`);
  }

  /**
   * Send a custom activity
   */
  async sendCustomActivity(label: string, eventId: string): Promise<ApiResponse<CustomActivityResult>> {
    return this.apiClient.post<CustomActivityResult>('/launcher/', "sendCustomActivity", {
      launcherJwt: this.getJwt(),
      label,
      eventId
    });
  }

  /**
   * Get state for a user
   */
  async getState<T>(label?: string, limit?: number, skip?: number): Promise<ApiResponse<State<T>[]>> {
    return this.apiClient.post<State<T>[]>('/launcher/', "getState", {
      launcherJwt: this.getJwt(),
      label,
      limit,
      skip
    });
  }

  /**
   * Set state for a user
   */
  async setState<T>(label: string, state: T): Promise<ApiResponse<{ success: boolean, newState: State<any> }>> {
    return this.apiClient.post('/launcher/', 'setState', {
      launcherJwt: this.getJwt(),
      label,
      state: JSON.stringify(state)
    });
  }

  /**
   * Get leaderboard for a game
   */
  async getLeaderboard(gameId: string, limit: number, skip: number): Promise<ApiResponse<{ leaderboard: LeaderboardEntry[] }>> {
    return this.apiClient.post('/scores/', "getGameScoresLeaderboard", {
      gameId,
      limit,
      skip
    });
  }

  /**
   * Get user position in leaderboard
   */
  async getUserLeaderboardPosition(gameId: string, wallet: string): Promise<ApiResponse<{ position: number }>> {
    return this.apiClient.post('/launcher/', 'getUsersPositionInGameScoreLeaderboard', {
      gameId,
      wallet
    });
  }

  /**
   * Get scores for a user
   */
  async getUserScores(limit: number, skip: number, nonce?: string): Promise<ApiResponse<{ scores: { score: number, nonce: string, updatedAt: number }[] }>> {
    return this.apiClient.post('/launcher/', 'getUserScores', {
      launcherJwt: this.getJwt(),
      limit,
      skip,
      nonce
    });
  }

  /**
   * Set score for a user
   */
  async setUserScore(score: number, nonce: string): Promise<ApiResponse<{ newScore: any }>> {
    return this.apiClient.post('/launcher/', 'setUserScore', {
      launcherJwt: this.getJwt(),
      score,
      nonce
    });
  }

  /**
   * Create an unverified channel
   */
  async createUnverifiedChannel(wallet: string): Promise<ApiResponse<{ signRequest: string, channelId: string }>> {
    return this.apiClient.post('/launcher/', 'createUnverifiedChannel', { wallet });
  }

  /**
   * Verify an unverified channel
   */
  async verifyUnverifiedChannel(channelId: string, signature: string, chainId?: number): Promise<ApiResponse<{ jwt: string }>> {
    return this.apiClient.post('/launcher/', 'verifyUnverifiedChannel', {
      channelId,
      signature,
      chainId
    });
  }

  /**
   * Send channel heartbeat
   */
  async channelHeartbeat(): Promise<ApiResponse<{ success: boolean }>> {
    return this.apiClient.post('/launcher/', 'channelHeartbeat', { 
      launcherJwt: this.getJwt() 
    });
  }

  /**
   * Trigger rules engine
   */
  async triggerRulesEngine(trigger: string, options?: {
    nonce?: string;
    value?: any;
    otherWallet?: string;
    walletToTip?: string;
    amountEth?: string;
    chainId?: number;
    profileAddress?: string;
    interactionId?: string;
    contractAddress?: string;
    mintNftlayout?: string;
  }): Promise<ApiResponse<{ triggerUuid: string, actions: string[] }>> {
    return this.apiClient.post('/launcher/', 'triggerRulesEngine', {
      launcherJwt: this.getJwt(),
      trigger,
      ...options
    });
  }

  /**
   * Create a message channel
   */
  async createMessageChannel(otherParticipants: `0x${string}`[]): Promise<ApiResponse<MessageChannel>> {
    return this.apiClient.post<MessageChannel>('/launcher/', 'createMessageChannel', {
      launcherJwt: this.getJwt(),
      otherParticipants
    });
  }

  /**
   * Get message channels
   */
  async getMessageChannels(limit: number, skip: number): Promise<ApiResponse<{ total: number, limit: number, skip: number, data: MessageChannel[] }>> {
    return this.apiClient.post('/launcher/', 'getMessageChannels', {
      launcherJwt: this.getJwt(),
      limit,
      skip
    });
  }

  /**
   * Get messages in a channel
   */
  async getChannelMessages(channelId: string, limit: number, skip: number): Promise<ApiResponse<{ total: number, limit: number, skip: number, data: ChannelMessage[] }>> {
    return this.apiClient.post('/launcher/', 'getChannelMessages', {
      launcherJwt: this.getJwt(),
      channelId,
      limit,
      skip
    });
  }

  /**
   * Send a message to a channel
   */
  async sendChannelMessage(channelId: string, content: string): Promise<ApiResponse<ChannelMessage>> {
    return this.apiClient.post<ChannelMessage>('/launcher/', 'sendChannelMessage', {
      launcherJwt: this.getJwt(),
      channelId,
      content
    });
  }

  /**
   * Edit a message in a channel
   */
  async editChannelMessage(messageId: string, newContent: string): Promise<ApiResponse<ChannelMessage>> {
    return this.apiClient.post<ChannelMessage>('/launcher/', 'editChannelMessage', {
      launcherJwt: this.getJwt(),
      messageId,
      newContent
    });
  }

  /**
   * Unsend a message in a channel
   */
  async unsendChannelMessage(messageId: string): Promise<ApiResponse<ChannelMessage>> {
    return this.apiClient.post<ChannelMessage>('/launcher/', 'unsendChannelMessage', {
      launcherJwt: this.getJwt(),
      messageId
    });
  }

  /**
   * Open a tip modal
   */
  openTipModal(walletToTip: string): void {
    if (this.releaseType != "embedded") {
      throw new Error("Cannot use the modals outside an embedded context");
    }
    if (typeof window !== 'undefined') {
      window.parent.postMessage({
        type: "TIP_REQUEST",
        data: { walletToTip }
      }, "*");
    }
  }

  /**
   * Open a trade modal
   */
  openTradeModal(otherWallet: string): void {
    if (this.releaseType != "embedded") {
      throw new Error("Cannot use the modals outside an embedded context");
    }
    if (typeof window !== 'undefined') {
      window.parent.postMessage({
        type: "TRADE_REQUEST",
        data: { otherWallet }
      }, "*");
    }
  }
}

// Export types
export * from './types';

// Create default export
export default B3WebSDK; 