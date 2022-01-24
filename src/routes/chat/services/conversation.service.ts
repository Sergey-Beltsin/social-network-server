import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Conversation } from '@/routes/chat/entities/conversation.entity';
import { Repository } from 'typeorm';
import { ActiveConversation } from '@/routes/chat/entities/active-conversation.entity';
import { Message } from '@/routes/chat/entities/message.entity';
import { Profile } from '@/routes/profile/entities/profile.entity';
import { IConversation } from '@/routes/chat/interfaces/conversation.interface';
import { IMessage } from '@/routes/chat/interfaces/message.interface';
import { ProfileService } from '@/routes/profile/services/profile.service';
import { UsersService } from '@/routes/users/services/users.service';
import { IProfile } from '@/routes/profile/interfaces/profile.interface';

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
    @InjectRepository(ActiveConversation)
    private readonly activeConversationRepository: Repository<ActiveConversation>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    private readonly profileService: ProfileService,
    private readonly usersService: UsersService,
  ) {}

  async getConversation(creatorId, friendId) {
    return await this.conversationRepository
      .createQueryBuilder('conversation')
      .leftJoinAndSelect('conversation.users', 'user')
      .where('user.id = :friendId', { friendId })
      .orWhere('user.id = :creatorId', { creatorId })
      .leftJoinAndSelect('conversation.messages', 'messages')
      .getOne();
  }

  async createConversation(
    creator: IProfile,
    friend: IProfile,
  ): Promise<{ conversation: IConversation; isBeenExists: boolean }> {
    const existedConversation = await this.getConversation(
      creator.id,
      friend.id,
    );

    if (existedConversation) {
      return { conversation: existedConversation, isBeenExists: true };
    }

    const conversation: IConversation = {
      users: [creator, friend],
    };

    return {
      conversation: await this.conversationRepository.save(conversation),
      isBeenExists: false,
    };
  }

  async getConversationsWithUsers(userId: string) {
    return (
      await this.conversationRepository
        .createQueryBuilder('conversation')
        .leftJoinAndSelect('conversation.users', 'user')
        .leftJoinAndSelect('conversation.messages', 'messages')
        .leftJoinAndSelect('messages.user', 'messageUser')
        .orderBy('conversation.lastUpdated', 'DESC')
        .where('user.id = :userId', { userId })
        .getMany()
    ).map((conversation) => ({
      ...conversation,
      messages: conversation.messages.map((message) => ({
        ...message,
        isOwnerMessage: message.user.id === userId,
      })),
    }));
  }

  async createMessage(message: IMessage) {
    return await this.messageRepository.save(message);
  }

  async getMessages(conversationId: string) {
    return await this.messageRepository.find({
      where: { conversation: { id: conversationId } },
      order: {
        created: 'ASC',
      },
      relations: ['user'],
    });
  }

  async joinConversation(socketId: string, userId: string) {
    console.log('joined', socketId);
    this.profileService.setIsOnline(userId, true);
    this.usersService.setSocketId(userId, socketId);
  }

  async leaveConversation(socketId: string, userId: string) {
    console.log('leaved', socketId);
    this.profileService.setIsOnline(userId, false);
    this.usersService.setSocketId(userId, null);
  }
}
