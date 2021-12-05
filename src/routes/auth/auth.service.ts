import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { compareSync, hash } from 'bcrypt';

import { Users } from '@/routes/users/users.entity';
import { Response } from '@/types/global';
import { UserLoginDto } from './dto/user-login.dto';
import { UserCreateDto } from './dto/user-create.dto';
import { EMAIL_OR_PASSWORD_INCORRECT } from './auth.constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  async login(user: UserLoginDto): Promise<Response> {
    const userDetails = await this.usersRepository.findOne({
      email: user.email,
    });

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

    delete userDetails.password;

    return new Response({
      user: { ...userDetails },
      access_token: this.jwtService.sign({
        username: userDetails.username,
        sub: userDetails.id,
      }),
    });
  }

  async create(user: UserCreateDto): Promise<Response> {
    const userDTO = { ...user, password: await hash(user.password, 10) };

    await this.usersRepository.save(userDTO).catch((error) => {
      console.log(error);
      throw new HttpException('alreadyExists', HttpStatus.BAD_REQUEST);
    });

    delete user.password;

    return new Response(user);
  }
}
