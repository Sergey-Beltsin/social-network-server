import { Controller, Get, Param, UseGuards } from '@nestjs/common';

import { ProfileService } from '@/routes/profile/profile.service';
import { AuthUser } from '@/routes/users/decorators/auth-user.decorator';
import { IUser } from '@/routes/users/interfaces/user.interface';
import { JwtAuthGuard } from '@/routes/auth/strategy/jwt-auth.guard';
import { Response } from '@/types/global';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getCurrentProfileInfo(@AuthUser() user: IUser): Promise<Response> {
    return this.profileService.getProfileInfo(user.id);
  }

  @Get('/:id')
  async getProfileInfo(@Param('id') id: string): Promise<Response> {
    return this.profileService.getProfileInfo(id);
  }
}
