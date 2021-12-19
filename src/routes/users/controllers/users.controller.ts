import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';

import { UsersService } from '@/routes/users/services/users.service';
import { JwtAuthGuard } from '@/routes/auth/strategy/jwt-auth.guard';
import { AuthUser } from '@/routes/users/decorators/auth-user.decorator';
import { IUser } from '@/routes/users/interfaces/user.interface';
import { Profile } from '@/routes/profile/entities/profile.entity';
import { Response } from '@/types/global';
import { IProfile } from '@/routes/profile/interfaces/profile.interface';
import { FriendRequestStatus } from '@/routes/users/interfaces/friend-request.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAll(
    @Query('q') query: string,
    @AuthUser() user: IUser,
  ): Promise<Response> {
    return new Response(await this.usersService.getAllUsers(user.id, query));
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

  @Get('/friend-request/incoming')
  @UseGuards(JwtAuthGuard)
  async getUserIncomingFriendRequests(@AuthUser() user: IUser) {
    return new Response(
      await this.usersService.getUserIncomingFriendRequests(user.id),
    );
  }

  @Put('/friend-request/:id')
  @UseGuards(JwtAuthGuard)
  async respondOnFriendRequest(
    @Param('id') id: string,
    @Body('status') status: FriendRequestStatus,
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
