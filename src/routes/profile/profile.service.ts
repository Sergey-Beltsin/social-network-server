import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Not, Repository } from 'typeorm';

import { Response } from '@/types/global';
import { Profile } from '@/routes/profile/profile.entity';
import { Users } from '@/routes/users/users.entity';
import { userPublicFields } from '@/constants/user';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async getAll(id: string) {
    return await this.profileRepository.find({
      where: {
        id: Not(id),
      },
    });
  }

  async getByQuery(query: string, id: string): Promise<Profile[]> {
    return await this.profileRepository.find({
      where: [
        { name: ILike(`%${query}%`), id: Not(id) },
        { surname: ILike(`%${query}%`), id: Not(id) },
        { username: ILike(`%${query}%`), id: Not(id) },
      ],
    });
  }

  async getProfileInfo(id: string): Promise<Response> {
    const profile = await this.profileRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!profile) {
      return new HttpException(
        new Response('Profile not found'),
        HttpStatus.BAD_REQUEST,
      );
    }

    return new Response(profile);
  }

  async createProfile({ id, name, surname, username }): Promise<Profile> {
    return await this.profileRepository
      .save({
        id,
        bio: '',
        name,
        surname,
        username,
      })
      .catch(() => {
        throw new HttpException('alreadyExists', HttpStatus.BAD_REQUEST);
      });
  }
}
