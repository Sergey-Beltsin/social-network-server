import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersService } from './services/users.service';
import { UsersController } from '@/routes/users/controllers/users.controller';
import { Users } from '@/routes/users/entities/users.entity';
import { ProfileService } from '@/routes/profile/services/profile.service';
import { Profile } from '@/routes/profile/entities/profile.entity';
import { Posts } from '@/routes/posts/entities/posts.entity';
import { PostsService } from '@/routes/posts/services/posts.service';
import { FriendRequest } from '@/routes/users/entities/friend-request.entity';
import { FriendRequestService } from '@/routes/users/services/friend-request.service';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Profile, Posts, FriendRequest])],
  providers: [UsersService, ProfileService, PostsService, FriendRequestService],
  controllers: [UsersController],
})
export class UsersModule {}
