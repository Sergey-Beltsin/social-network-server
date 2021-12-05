import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from '@/routes/users/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '@/routes/users/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
