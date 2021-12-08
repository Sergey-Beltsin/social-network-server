import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Response } from '@/types/global';
import { Profile } from '@/routes/profile/profile.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

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
