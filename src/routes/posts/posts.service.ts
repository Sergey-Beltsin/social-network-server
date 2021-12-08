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

    return await this.postRepository.find({
      order: {
        created: 'DESC',
      },
      relations: ['profile'],
      take: limit,
      skip: page * limit - limit,
    });
  }

  async createPost(id: string, post: PostCreateDto) {
    const profile = await this.profileService.getProfileInfo(id);

    const newPost = await this.postRepository.save({
      ...post,
      likes: [],
      profile,
    });

    await this.profileService.savePostToProfile(profile.id, newPost);

    return new Response(newPost);
  }
}
