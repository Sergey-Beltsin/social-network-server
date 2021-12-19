import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PostsService } from '@/routes/posts/services/posts.service';
import { Posts } from '@/routes/posts/entities/posts.entity';
import { PostsController } from '@/routes/posts/controllers/posts.controller';
import { ProfileService } from '@/routes/profile/services/profile.service';
import { Profile } from '@/routes/profile/entities/profile.entity';
import { FriendRequest } from '@/routes/users/entities/friend-request.entity';
import { Users } from '@/routes/users/entities/users.entity';
import { UsersService } from '@/routes/users/services/users.service';
import { FriendRequestService } from '@/routes/users/services/friend-request.service';

@Module({
  imports: [TypeOrmModule.forFeature([Posts, Profile, Users, FriendRequest])],
  providers: [PostsService, ProfileService, UsersService, FriendRequestService],
  controllers: [PostsController],
})
export class PostsModule {}
