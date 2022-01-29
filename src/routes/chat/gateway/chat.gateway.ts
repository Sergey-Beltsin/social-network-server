import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@/routes/auth/strategy/jwt-auth.guard';
import { AuthService } from '@/routes/auth/services/auth.service';
import { ConversationService } from '@/routes/chat/services/conversation.service';
import { IMessage } from '@/routes/chat/interfaces/message.interface';
import { ProfileService } from '@/routes/profile/services/profile.service';
import { SendMessageDto } from '@/routes/chat/dto/send-message.dto';
import { UsersService } from '@/routes/users/services/users.service';

@WebSocketGateway()
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly authService: AuthService,
    private readonly conversationService: ConversationService,
    private readonly profileService: ProfileService,
    private readonly usersService: UsersService,
  ) {}

  @WebSocketServer()
  server: Server;

  @UseGuards(JwtAuthGuard)
  async handleConnection(socket: Socket) {
    const jwt = socket.handshake.headers.authorization || null;

    if (!jwt) {
      this.handleDisconnect(socket);
      return;
    }

    try {
      const user = await this.authService.getJwtUser(jwt);
      socket.data.user = await this.profileService.getProfileInfo(user.sub);

      this.conversationService.joinConversation(socket.id, user.sub);
    } catch (e) {
      console.log(e);
      this.handleDisconnect(socket);
    }
  }

  @SubscribeMessage('getConversations')
  async getConversations(socket: Socket) {
    return await this.conversationService
      .getConversationsWithUsers(socket.data.user.id)
      .then((conversations) =>
        this.server.to(socket.id).emit('conversations', conversations),
      );
  }

  @SubscribeMessage('sendMessage')
  async sendMessage(socket: Socket, messageDto: SendMessageDto) {
    if (!messageDto.user) {
      return null;
    }

    const { user } = socket.data;

    const message: IMessage = {
      message: messageDto.message,
      user,
    };

    const conversation = messageDto.conversationId
      ? await this.conversationService.getConversationById(
          messageDto.conversationId,
        )
      : await this.conversationService.createConversation(
          user,
          messageDto.user,
        );

    message.conversation = conversation;

    const newMessage = await this.conversationService.createMessage(message);

    this.usersService.getSocketId(messageDto.user.id).then((socketId) => {
      console.log(
        `New message has emitted to user ${messageDto.user.username}. Message is: ${newMessage.message}`,
      );
      if (!messageDto.conversationId) {
        this.server.to(socketId).emit('newConversation', conversation);
        this.server.to(socket.id).emit('newConversation', conversation);
      }

      console.log(socketId, 'asdasdasd');
      this.server
        .to(socketId)
        .emit('newMessage', { ...newMessage, isOwnerMessage: false });
      this.server
        .to(socket.id)
        .emit('newMessage', { ...newMessage, isOwnerMessage: true });
    });
  }

  afterInit(server: any): any {
    return;
  }

  handleDisconnect(socket: Socket): any {
    if (socket.data.user) {
      this.conversationService.leaveConversation(
        socket.id,
        socket.data.user.id,
      );
    }
  }
}
