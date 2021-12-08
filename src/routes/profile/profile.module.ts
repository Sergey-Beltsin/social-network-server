import { Module } from '@nestjs/common';
import { ProfileController } from '@/routes/profile/profile.controller';
import { ProfileService } from '@/routes/profile/profile.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from '@/routes/profile/profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Profile])],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
