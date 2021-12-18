import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PostsService } from '@/routes/posts/posts.service';
import { Posts } from '@/routes/posts/posts.entity';
import { PostsController } from '@/routes/posts/posts.controller';
import { ProfileService } from '@/routes/profile/profile.service';
import { Profile } from '@/routes/profile/profile.entity';
import { FriendRequest } from '@/routes/users/entities/friend-request.entity';
import { Users } from '@/routes/users/entities/users.entity';
import { UsersService } from '@/routes/users/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([Posts, Profile, Users, FriendRequest])],
  providers: [PostsService, ProfileService, UsersService],
  controllers: [PostsController],
})
export class PostsModule {}
