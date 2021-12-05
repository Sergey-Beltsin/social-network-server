import { Module } from '@nestjs/common';
import { ProfileController } from '@/routes/profile/profile.controller';
import { ProfileService } from '@/routes/profile/profile.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '@/routes/users/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
