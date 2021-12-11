import { Controller, Get, Param, Query, Res, UseGuards } from '@nestjs/common';

import { UsersService } from '@/routes/users/users.service';
import { JwtAuthGuard } from '@/routes/auth/strategy/jwt-auth.guard';
import { AuthUser } from '@/routes/users/decorators/auth-user.decorator';
import { IUser } from '@/routes/users/interfaces/user.interface';
import { Profile } from '@/routes/profile/profile.entity';
import { Response } from '@/types/global';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAll(
    @Query('q') query: string,
    @AuthUser() user: IUser,
  ): Promise<Profile[]> {
    if (query) {
      return this.usersService.getByQuery(query, user.id);
    }

    return this.usersService.getAll(user.id);
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async getByIdOrUsername(@Param('id') id: string) {
    return new Response(await this.usersService.getByIdOrUsername(id));
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
}
