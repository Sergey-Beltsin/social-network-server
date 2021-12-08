import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Not, Repository } from 'typeorm';
import { hash } from 'bcrypt';

import { Users } from '@/routes/users/users.entity';
import { userPublicFields } from '@/constants/user';
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

  async getAll(id: string): Promise<Users[]> {
    return await this.usersRepository.find({
      select: userPublicFields,
      where: {
        id: Not(id),
      },
    });
  }

  async getByQuery(query: string, id: string): Promise<Users[]> {
    return await this.usersRepository.find({
      where: [
        { name: ILike(`%${query}%`), id: Not(id) },
        { surname: ILike(`%${query}%`), id: Not(id) },
        { username: ILike(`%${query}%`), id: Not(id) },
      ],
      select: userPublicFields,
    });
  }

  async findByEmail(email: string): Promise<Users> {
    return await this.usersRepository.findOne({
      where: {
        email,
      },
    });
  }

  async create(user: UserCreateDto): Promise<UserCreateDto> {
    const userDTO = { ...user, password: await hash(user.password, 10) };

    const newUser = await this.usersRepository.save(userDTO).catch((error) => {
      console.log(error);
      throw new HttpException('alreadyExists', HttpStatus.BAD_REQUEST);
    });

    await this.profileService.createProfile(newUser);

    return user;
  }
}
