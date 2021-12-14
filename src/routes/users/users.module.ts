import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersService } from './users.service';
import { UsersController } from '@/routes/users/users.controller';
import { Users } from '@/routes/users/entities/users.entity';
import { ProfileService } from '@/routes/profile/profile.service';
import { Profile } from '@/routes/profile/profile.entity';
import { Posts } from '@/routes/posts/posts.entity';
import { PostsService } from '@/routes/posts/posts.service';
import { FriendRequest } from '@/routes/users/entities/friend-request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Profile, Posts, FriendRequest])],
  providers: [UsersService, ProfileService, PostsService],
  controllers: [UsersController],
})
export class UsersModule {}
