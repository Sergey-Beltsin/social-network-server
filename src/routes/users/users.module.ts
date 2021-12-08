import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from '@/routes/users/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '@/routes/users/users.entity';
import { ProfileService } from '@/routes/profile/profile.service';
import { Profile } from '@/routes/profile/profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Profile])],
  providers: [UsersService, ProfileService],
  controllers: [UsersController],
})
export class UsersModule {}
