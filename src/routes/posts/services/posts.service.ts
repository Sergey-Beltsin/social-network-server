import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Posts } from '@/routes/posts/entities/posts.entity';
import { Response } from '@/types/global';
import { PostCreateDto } from '@/routes/posts/dto/post-create.dto';
import { ProfileService } from '@/routes/profile/services/profile.service';
import { UsersService } from '@/routes/users/services/users.service';

const mapPostLikes = (posts: Posts[] | Posts, userId: string) => {
  if (Array.isArray(posts)) {
    return posts.map((post) => ({
      ...post,
      likesCount: post.likes.length,
      isLiked: post.likes.includes(userId),
    }));
  }

  return {
    ...posts,
    likesCount: posts.likes.length,
    isLiked: posts.likes.includes(userId),
  };
};

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Posts) private readonly postRepository: Repository<Posts>,
    private readonly profileService: ProfileService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  async getAll(page = 1, limit = 10, userId: string, requestedUserId?: string) {
    if (page <= 0 || limit < 10) {
      throw new HttpException(
        new Response(
          'The page must be greater than 0 and the limit is greater than 10',
        ),
        HttpStatus.BAD_REQUEST,
      );
    }

    const friends = await this.usersService.getFriends(userId);
    const subscribedUsers = await this.usersService.getSubscribedUsers(userId);

    const [posts, postsCount] = await this.postRepository.findAndCount({
      where: requestedUserId
        ? {
            profile: {
              id: requestedUserId,
            },
          }
        : null,
      order: {
        created: 'DESC',
      },
      relations: ['profile'],
      take: limit,
      skip: page * limit - limit,
    });

    return {
      posts: mapPostLikes(
        requestedUserId
          ? posts
          : posts.filter(
              (post) =>
                post.profile.id === userId ||
                friends.find((friend) => friend.id === post.profile.id) ||
                subscribedUsers.find(
                  (req) => req.receiver.id === post.profile.id,
                ),
            ),
        userId,
      ),
      pages: Math.ceil(postsCount / limit),
    };
  }

  async createPost(userId: string, post: PostCreateDto) {
    const profile = await this.profileService.getProfileInfo(userId);

    const newPost = await this.postRepository.save({
      ...post,
      likes: [],
      profile,
    });

    await this.profileService.savePostToProfile(profile.id, newPost);

    return mapPostLikes(newPost, userId);
  }

  async likePost(userId: string, postId: string) {
    try {
      const post = await this.postRepository.findOne({
        where: {
          id: postId,
        },
        relations: ['profile'],
      });

      if (post.likes.some((id) => id === userId)) {
        post.likes.splice(post.likes.indexOf(userId), 1);
        return mapPostLikes(await this.postRepository.save(post), userId);
      }

      post.likes.push(userId);

      return mapPostLikes(await this.postRepository.save(post), userId);
    } catch (e) {
      console.log(e);

      throw new HttpException(e.response, HttpStatus.BAD_REQUEST);
    }
  }
}
