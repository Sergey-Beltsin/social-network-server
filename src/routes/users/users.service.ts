import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hash } from 'bcrypt';
import { v4 } from 'uuid';

import { Users } from '@/routes/users/entities/users.entity';
import { UserCreateDto } from '@/routes/auth/dto/user-create.dto';
import { ProfileService } from '@/routes/profile/profile.service';
import { Profile } from '@/routes/profile/profile.entity';
import { userPublicFields, uuidRegex } from '@/constants/user';
import { PostsService } from '@/routes/posts/posts.service';
import { FriendRequest } from '@/routes/users/entities/friend-request.entity';
import { IProfile } from '@/routes/profile/interfaces/profile.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectRepository(FriendRequest)
    private readonly friendRequestRepository: Repository<FriendRequest>,
    private readonly profileService: ProfileService,
    private readonly postsService: PostsService,
  ) {}

  async getAllUsers(userId: string): Promise<IProfile[]> {
    const users = await this.profileService.getAll(userId);
    const friends = await this.getFriends(userId);

    return users.map((user) => ({
      ...user,
      friendStatus:
        friends.find((friend) => friend.id === user.id)?.friendStatus ||
        'not-sent',
    }));
  }

  async getUsersByQuery(query: string, id: string): Promise<Profile[]> {
    return await this.profileService.getByQuery(query, id);
  }

  async findUserByEmail(email: string, relations?: string[]): Promise<Users> {
    return await this.usersRepository.findOne({
      where: {
        email,
      },
      relations,
    });
  }

  async createUser(user: UserCreateDto): Promise<UserCreateDto> {
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

  async getUserByIdOrUsername(id: string) {
    if (uuidRegex.test(id)) {
      return await this.usersRepository.findOne({
        where: {
          id,
        },
        relations: ['profile'],
        select: userPublicFields,
      });
    }

    return await this.usersRepository.findOne({
      where: {
        profile: {
          username: id,
        },
      },
      relations: ['profile'],
      select: userPublicFields,
    });
  }

  async getPostsById(
    page: number,
    limit: number,
    userId: string,
    requestedUserId: string,
  ) {
    return await this.postsService.getAll(page, limit, userId, requestedUserId);
  }

  async getFriendRequestById(friendRequestId: string) {
    return await this.friendRequestRepository.findOne(friendRequestId);
  }

  async isRequestSentOrDeclined(
    receiver: Users,
    creator: Users,
  ): Promise<boolean> {
    return this.friendRequestRepository
      .findOne({
        where: [
          { creator, receiver },
          { creator: receiver, receiver: creator },
        ],
      })
      .then((req) => {
        return !!req;
      });
  }

  async createFriendRequest(receiverId: string, creatorId: string) {
    if (receiverId === creatorId) {
      throw new HttpException(
        "Isn't possible to request friend to yourself",
        HttpStatus.BAD_REQUEST,
      );
    }

    const receiver = await this.usersRepository.findOne(receiverId);
    const creator = await this.usersRepository.findOne(creatorId);

    if (await this.isRequestSentOrDeclined(receiver, creator)) {
      throw new HttpException(
        'Request already had been sent or declined',
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.friendRequestRepository.save({
      receiver,
      creator,
      status: 'waiting-for-response',
    });
  }

  async respondOnFriendRequest(
    status: 'accepted' | 'declined',
    friendRequestId: string,
  ) {
    const friendRequest = await this.getFriendRequestById(friendRequestId);

    if (!friendRequestId) {
      throw new HttpException(
        'No friend request find with the same id',
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.friendRequestRepository.save({
      ...friendRequest,
      status,
    });
  }

  async getFriends(userId: string) {
    const user = await this.getUserByIdOrUsername(userId);

    const requests = await this.friendRequestRepository.find({
      where: [
        { creator: user, status: 'accepted' },
        { receiver: user, status: 'accepted' },
      ],
      relations: ['creator', 'receiver'],
    });

    const userIds: { userId: string; reqId: string }[] = [];
    const friends = [];

    for (const request of requests) {
      if (request.creator.id === userId) {
        const user = await this.usersRepository.findOne(request.receiver.id, {
          select: userPublicFields,
        });
        userIds.push({ userId: request.receiver.id, reqId: request.id });
        console.log((await this.getFriendRequestById(request.id)).status);
        friends.push({
          ...user,
          friendStatus: (await this.getFriendRequestById(request.id)).status,
        });
      } else if (request.receiver.id === userId) {
        userIds.push({ userId: request.creator.id, reqId: request.id });
      }
    }

    return friends;
  }
}
