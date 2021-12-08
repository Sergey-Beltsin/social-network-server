import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Users } from '@/routes/users/users.entity';
import { getJwtConfig } from '@/configs/jwt.config';
import { JwtStrategy } from './strategy/jwt.strategy';
import { UsersService } from '@/routes/users/users.service';
import { ProfileService } from '@/routes/profile/profile.service';
import { Profile } from '@/routes/profile/profile.entity';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: getJwtConfig,
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Users, Profile]),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    ConfigService,
    UsersService,
    ProfileService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
