import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';

import { ProfileService } from '@/routes/profile/services/profile.service';
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
    try {
      return new Response(await this.profileService.getProfileInfo(user.id));
    } catch (e) {
      return e.response;
    }
  }

  @Get('/:id')
  async getProfileInfo(@Param('id') id: string): Promise<Response> {
    try {
      return new Response(this.profileService.getProfileInfo(id));
    } catch (e) {
      return e.response;
    }
  }
}
