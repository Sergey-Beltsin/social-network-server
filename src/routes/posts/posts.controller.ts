import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';

import { PostsService } from '@/routes/posts/posts.service';
import { AuthUser } from '@/routes/users/decorators/auth-user.decorator';
import { IUser } from '@/routes/users/interfaces/user.interface';
import { PostCreateDto } from '@/routes/posts/dto/post-create.dto';
import { JwtAuthGuard } from '@/routes/auth/strategy/jwt-auth.guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAll(
    @AuthUser() user: IUser,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.postsService.getAll(page, limit);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createPost(@AuthUser() user: IUser, @Body() post: PostCreateDto) {
    return this.postsService.createPost(user.id, post);
  }
}
