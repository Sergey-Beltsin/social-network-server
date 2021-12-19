import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { Users } from '@/routes/users/entities/users.entity';
import { getJwtConfig } from '@/configs/jwt.config';
import { JwtStrategy } from './strategy/jwt.strategy';
import { UsersService } from '@/routes/users/services/users.service';
import { ProfileService } from '@/routes/profile/services/profile.service';
import { Profile } from '@/routes/profile/entities/profile.entity';
import { PostsService } from '@/routes/posts/services/posts.service';
import { Posts } from '@/routes/posts/entities/posts.entity';
import { FriendRequest } from '@/routes/users/entities/friend-request.entity';
import { FriendRequestService } from '@/routes/users/services/friend-request.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: getJwtConfig,
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Users, Profile, Posts, FriendRequest]),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    ConfigService,
    UsersService,
    ProfileService,
    PostsService,
    FriendRequestService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
