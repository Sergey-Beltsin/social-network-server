import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PostsService } from '@/routes/posts/posts.service';
import { Posts } from '@/routes/posts/posts.entity';
import { PostsController } from '@/routes/posts/posts.controller';
import { ProfileService } from '@/routes/profile/profile.service';
import { Profile } from '@/routes/profile/profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Posts, Profile])],
  providers: [PostsService, ProfileService],
  controllers: [PostsController],
})
export class PostsModule {}
