import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Not, Repository } from 'typeorm';

import { Users } from '@/routes/users/users.entity';
import { IJwtUser } from '@/routes/users/interfaces/user.interface';
import { userPublicFields } from '@/constants/user';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  async getAll(user: IJwtUser): Promise<Users[]> {
    return await this.usersRepository.find({
      select: userPublicFields,
      where: {
        id: Not(user.id),
      },
    });
  }

  async getByQuery(query: string, user: IJwtUser): Promise<Users[]> {
    return await this.usersRepository.find({
      where: [
        { name: ILike(`%${query}%`), id: Not(user.id) },
        { surname: ILike(`%${query}%`), id: Not(user.id) },
        { username: ILike(`%${query}%`), id: Not(user.id) },
      ],
      select: userPublicFields,
    });
  }
}
