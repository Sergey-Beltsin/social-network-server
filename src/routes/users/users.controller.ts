import { Controller, Get, Query, UseGuards } from '@nestjs/common';

import { UsersService } from '@/routes/users/users.service';
import { JwtAuthGuard } from '@/routes/auth/strategy/jwt-auth.guard';
import { AuthUser } from '@/routes/users/decorators/auth-user.decorator';
import { IJwtUser } from '@/routes/users/interfaces/user.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll(@Query('q') query: string, @AuthUser() user: IJwtUser) {
    if (query) {
      return this.usersService.getByQuery(query, user);
    }

    return this.usersService.getAll(user);
  }
}
