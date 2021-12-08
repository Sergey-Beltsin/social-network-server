import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hash } from 'bcrypt';
import { v4 } from 'uuid';

import { Users } from '@/routes/users/users.entity';
import { UserCreateDto } from '@/routes/auth/dto/user-create.dto';
import { ProfileService } from '@/routes/profile/profile.service';
import { Profile } from '@/routes/profile/profile.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    private readonly profileService: ProfileService,
  ) {}

  async getAll(id: string): Promise<Profile[]> {
    return await this.profileService.getAll(id);
  }

  async getByQuery(query: string, id: string): Promise<Profile[]> {
    return await this.profileService.getByQuery(query, id);
  }

  async findByEmail(email: string, relations?: string[]): Promise<Users> {
    return await this.usersRepository.findOne({
      where: {
        email,
      },
      relations,
    });
  }

  async create(user: UserCreateDto): Promise<UserCreateDto> {
    const userDTO = {
      ...user,
      password: await hash(user.password, 10),
      profile: null,
      id: v4(),
    };

    userDTO.profile = await this.profileService.createProfile({
      id: userDTO.id,
      name: user.name,
      surname: user.surname,
      username: user.username,
    });

    await this.usersRepository.save(userDTO).catch((error) => {
      console.log(error);
      throw new HttpException('alreadyExists', HttpStatus.BAD_REQUEST);
    });

    return user;
  }
}
