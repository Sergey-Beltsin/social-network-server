import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConversationService } from './services/conversation.service';
import { Conversation } from '@/routes/chat/entities/conversation.entity';
import { Message } from '@/routes/chat/entities/message.entity';
import { ActiveConversation } from '@/routes/chat/entities/active-conversation.entity';
import { AuthModule } from '@/routes/auth/auth.module';
import { ChatGateway } from '@/routes/chat/gateway/chat.gateway';
import { AuthService } from '@/routes/auth/services/auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UsersService } from '@/routes/users/services/users.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getJwtConfig } from '@/configs/jwt.config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '@/routes/auth/strategy/jwt.strategy';
import { Users } from '@/routes/users/entities/users.entity';
import { ProfileService } from '@/routes/profile/services/profile.service';
import { PostsService } from '@/routes/posts/services/posts.service';
import { FriendRequestService } from '@/routes/users/services/friend-request.service';
import { Profile } from '@/routes/profile/entities/profile.entity';
import { Posts } from '@/routes/posts/entities/posts.entity';
import { FriendRequest } from '@/routes/users/entities/friend-request.entity';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      Conversation,
      Message,
      ActiveConversation,
      Users,
      Profile,
      Posts,
      FriendRequest,
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: getJwtConfig,
      inject: [ConfigService],
    }),
    PassportModule,
  ],
  providers: [
    ChatGateway,
    ConversationService,
    AuthService,
    JwtStrategy,
    UsersService,
    ConfigService,
    ProfileService,
    PostsService,
    FriendRequestService,
  ],
})
export class ChatModule {}
