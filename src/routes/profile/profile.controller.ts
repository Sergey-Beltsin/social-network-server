import { Controller, Get, UseGuards } from '@nestjs/common';

import { ProfileService } from '@/routes/profile/profile.service';
import { AuthUser } from '@/routes/users/decorators/auth-user.decorator';
import { IJwtUser, IUser } from '@/routes/users/interfaces/user.interface';
import { JwtAuthGuard } from '@/routes/auth/strategy/jwt-auth.guard';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getProfileInfo(@AuthUser() user: IJwtUser): Promise<IUser> {
    return this.profileService.getProfileInfo(user.id);
  }
}
