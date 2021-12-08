import { Controller, Get, Query, UseGuards } from '@nestjs/common';

import { UsersService } from '@/routes/users/users.service';
import { JwtAuthGuard } from '@/routes/auth/strategy/jwt-auth.guard';
import { AuthUser } from '@/routes/users/decorators/auth-user.decorator';
import { IUser } from '@/routes/users/interfaces/user.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll(@Query('q') query: string, @AuthUser() user: IUser) {
    if (query) {
      return this.usersService.getByQuery(query, user.id);
    }

    return this.usersService.getAll(user.id);
  }
}
