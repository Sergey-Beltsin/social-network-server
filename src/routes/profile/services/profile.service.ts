import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, ILike, Not, Repository } from 'typeorm';

import { Response } from '@/types/global';
import { Profile } from '@/routes/profile/entities/profile.entity';
import { Posts } from '@/routes/posts/entities/posts.entity';
import { uuidRegex } from '@/constants/user';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async getAll(id: string, options?: FindManyOptions<Profile>) {
    return await this.profileRepository.find({
      where: {
        id: Not(id),
      },
      ...options,
    });
  }

  async getByQuery(
    query: string,
    id: string,
    options?: FindManyOptions<Profile>,
  ): Promise<Profile[]> {
    return await this.profileRepository.find({
      where: [
        { name: ILike(`%${query}%`), id: Not(id) },
        { surname: ILike(`%${query}%`), id: Not(id) },
        { username: ILike(`%${query}%`), id: Not(id) },
      ],
      ...options,
    });
  }

  async getProfileInfo(id: string): Promise<Profile> {
    const profile = await this.profileRepository.findOne({
      where: uuidRegex.test(id) ? { id } : { username: id },
    });

    if (!profile) {
      throw new HttpException(
        new Response('Profile not found'),
        HttpStatus.BAD_REQUEST,
      );
    }

    return profile;
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
      .catch((error) => {
        console.log(error);
        throw new HttpException('alreadyExists', HttpStatus.BAD_REQUEST);
      });
  }

  async savePostToProfile(profileId: string, post: Posts) {
    const profile = await this.profileRepository.findOne({
      where: {
        id: profileId,
      },
      relations: ['posts'],
    });
    profile.posts.push(post);

    return await this.profileRepository.save(profile);
  }

  async getByIds(ids: string[]) {
    return await this.profileRepository.findByIds(ids);
  }

  async getById(id: string) {
    return await this.profileRepository.findOne(id);
  }
}
