import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Posts } from '@/routes/posts/posts.entity';
import { Response } from '@/types/global';
import { PostCreateDto } from '@/routes/posts/dto/post-create.dto';
import { ProfileService } from '@/routes/profile/profile.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Posts) private readonly postRepository: Repository<Posts>,
    private readonly profileService: ProfileService,
  ) {}

  async getAll(page = 1, limit = 10): Promise<Posts[]> {
    if (page <= 0 || limit < 10) {
      throw new HttpException(
        new Response(
          'The page must be greater than 0 and the limit is greater than 10',
        ),
        HttpStatus.BAD_REQUEST,
      );
    }

    const posts = await this.postRepository.find({
      order: {
        created: 'DESC',
      },
    });
    console.log(posts);

    return posts;
  }

  async createPost(id: string, post: PostCreateDto) {
    try {
      const profile = await this.profileService.getProfileInfo(id);
      console.log(profile);

      const newPost = await this.postRepository.save({
        ...post,
        likes: [],
        profile,
      });
      console.log(newPost);

      await this.profileService.savePostToProfile(profile.id, newPost);

      console.log('success');
      return new Response('Post created success');
    } catch (e) {
      return e.response;
    }
  }
}
