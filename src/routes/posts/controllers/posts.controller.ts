import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { PostsService } from '@/routes/posts/services/posts.service';
import { AuthUser } from '@/routes/users/decorators/auth-user.decorator';
import { IUser } from '@/routes/users/interfaces/user.interface';
import { PostCreateDto } from '@/routes/posts/dto/post-create.dto';
import { JwtAuthGuard } from '@/routes/auth/strategy/jwt-auth.guard';
import { Response } from '@/types/global';

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
    return new Response(await this.postsService.getAll(page, limit, user.id));
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createPost(@AuthUser() user: IUser, @Body() post: PostCreateDto) {
    return new Response(await this.postsService.createPost(user.id, post));
  }

  @Post('/:id')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async likePost(@Param('id') id: string, @AuthUser() user: IUser) {
    return new Response(await this.postsService.likePost(user.id, id));
  }
}
