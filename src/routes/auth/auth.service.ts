import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcrypt';

import { Response } from '@/types/global';
import { UserLoginDto } from './dto/user-login.dto';
import { UserCreateDto } from './dto/user-create.dto';
import { EMAIL_OR_PASSWORD_INCORRECT } from './auth.constants';
import { UsersService } from '@/routes/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async login(user: UserLoginDto): Promise<Response> {
    const userDetails = await this.usersService.findByEmail(user.email, [
      'profile',
    ]);

    if (!userDetails) {
      throw new HttpException(
        EMAIL_OR_PASSWORD_INCORRECT,
        HttpStatus.BAD_REQUEST,
      );
    }

    const isValid: boolean = compareSync(user.password, userDetails.password);

    if (!isValid) {
      throw new HttpException(
        EMAIL_OR_PASSWORD_INCORRECT,
        HttpStatus.BAD_REQUEST,
      );
    }

    return new Response({
      profile: { ...userDetails.profile },
      access_token: this.jwtService.sign({
        email: userDetails.email,
        sub: userDetails.id,
      }),
    });
  }

  async create(user: UserCreateDto): Promise<Response> {
    const newUser = await this.usersService.create(user);

    return await this.login(newUser);
  }
}
