import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { UsersService } from '@/routes/users/users.service';
import { JwtAuthGuard } from '@/routes/auth/strategy/jwt-auth.guard';
import { AuthUser } from '@/routes/users/decorators/auth-user.decorator';
import { IUser } from '@/routes/users/interfaces/user.interface';
import { Profile } from '@/routes/profile/profile.entity';
import { Response } from '@/types/global';
import { IProfile } from '@/routes/profile/interfaces/profile.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAll(
    @Query('q') query: string,
    @AuthUser() user: IUser,
  ): Promise<IProfile[]> {
    if (query) {
      return this.usersService.getUsersByQuery(query, user.id);
    }

    return this.usersService.getAllUsers(user.id);
  }

  @Post('/friend-request')
  @UseGuards(JwtAuthGuard)
  async createFriendRequest(
    @Body('receiverId') receiverId: string,
    @AuthUser() creator: IUser,
  ) {
    return new Response(
      await this.usersService.createFriendRequest(receiverId, creator.id),
    );
  }

  @Post('/friend-request/:id')
  @UseGuards(JwtAuthGuard)
  async respondOnFriendRequest(
    @Param('id') id: string,
    @Body('status') status: 'accepted' | 'declined',
  ) {
    return new Response(
      await this.usersService.respondOnFriendRequest(status, id),
    );
  }

  @Get('/friend-request/:id')
  @UseGuards(JwtAuthGuard)
  async getFriendRequestById(@Param('id') friendRequestId: string) {
    return new Response(
      await this.usersService.getFriendRequestById(friendRequestId),
    );
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async getByIdOrUsername(@Param('id') id: string) {
    return new Response(await this.usersService.getUserByIdOrUsername(id));
  }

  @Get('/:id/posts')
  @UseGuards(JwtAuthGuard)
  async getPostsById(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Param('id') id: string,
    @AuthUser() user: IUser,
  ) {
    return new Response(
      await this.usersService.getPostsById(page, limit, user.id, id),
    );
  }

  @Get('/:id/friends')
  @UseGuards(JwtAuthGuard)
  async getFriends(@Param('id') userId: string) {
    return new Response(await this.usersService.getFriends(userId));
  }
}
