import { Module } from '@nestjs/common';
import { ProfileController } from '@/routes/profile/controllers/profile.controller';
import { ProfileService } from '@/routes/profile/services/profile.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from '@/routes/profile/entities/profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Profile])],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
