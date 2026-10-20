export interface ChatMessage {
  id: string;
  senderId: string;
  room: string;
  content: string;
  sentAt: number;
}

export class WebSocketGateway {
  private static connections: Map<string, { socketId: string; userId: string; room: string }> = new Map();

  public static handleConnection(socketId: string, userId: string, room: string): void {
    this.connections.set(socketId, { socketId, userId, room });
  }

  public static handleDisconnect(socketId: string): void {
    this.connections.delete(socketId);
  }

  public static broadcastToRoom(room: string, message: ChatMessage): ChatMessage[] {
    const recipients: ChatMessage[] = [];
    for (const [, conn] of this.connections) {
      if (conn.room === room) {
        recipients.push(message);
      }
    }
    return recipients;
  }
}
