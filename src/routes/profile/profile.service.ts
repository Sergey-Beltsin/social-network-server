import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Users } from '@/routes/users/users.entity';
import { IUser } from '@/routes/users/interfaces/user.interface';
import { userPublicFields } from '@/constants/user';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  async getProfileInfo(id: number): Promise<IUser> {
    return await this.usersRepository.findOne({
      where: {
        id: id,
      },
      select: userPublicFields,
    });
  }
}
