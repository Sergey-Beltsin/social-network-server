import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
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
import { FriendRequestStatus } from '@/routes/users/interfaces/friend-request.interface';

const getFriendRequestStatusByUser = (
  role: 'receiver' | 'creator',
  status: FriendRequestStatus,
): FriendRequestStatus => {
  if (role === 'receiver') {
    if (status === 'declined') {
      return 'waiting-for-response';
    }

    return status;
  }

  if (status === 'waiting-for-response') {
    return 'sent';
  }

  return status;
};

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectRepository(FriendRequest)
    private readonly friendRequestRepository: Repository<FriendRequest>,
    private readonly profileService: ProfileService,
    @Inject(forwardRef(() => PostsService))
    private readonly postsService: PostsService,
  ) {}

  async getAllUsers(userId: string, query: string): Promise<IProfile[]> {
    const friends = await this.getFriends(userId);
    const users = (
      await (query
        ? this.profileService.getByQuery(query, userId)
        : this.profileService.getAll(userId))
    ).filter((user) => !friends.find((friend) => user.id === friend.id));
    const friendRequests = await this.friendRequestRepository.find({
      relations: ['creator', 'receiver'],
    });

    return users.map((user) => {
      const friendRequest = friendRequests.find(
        (req) => user.id === req.creator.id || user.id === req.receiver.id,
      );

      if (friendRequest) {
        return {
          ...user,
          friendRequest: {
            id: friendRequest.id,
            status: getFriendRequestStatusByUser(
              userId === friendRequest.receiver.id ? 'receiver' : 'creator',
              friendRequest.status,
            ),
          },
        };
      }

      return user;
    });
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

  async getFriendRequestById(
    friendRequestId: string,
    options?: FindOneOptions<FriendRequest>,
  ) {
    return await this.friendRequestRepository.findOne(friendRequestId, options);
  }

  async isRequestSentOrDeclined(
    receiver: Profile,
    creator: Profile,
  ): Promise<boolean> {
    return this.friendRequestRepository
      .findOne({
        where: [
          { creator, receiver },
          { creator: receiver, receiver: creator },
        ],
      })
      .then((req) => {
        return !!(req && req.status !== 'not-sent');
      });
  }

  async createFriendRequest(receiverId: string, creatorId: string) {
    if (receiverId === creatorId) {
      throw new HttpException(
        "Isn't possible to request friend to yourself",
        HttpStatus.BAD_REQUEST,
      );
    }

    const receiver = await this.profileService.getProfileInfo(receiverId);
    const creator = await this.profileService.getProfileInfo(creatorId);

    if (await this.isRequestSentOrDeclined(receiver, creator)) {
      throw new HttpException(
        'Request already had been sent or declined',
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      ...(await this.friendRequestRepository.save({
        receiver,
        creator,
        status: 'waiting-for-response',
      })),
      status: 'sent',
    };
  }

  async respondOnFriendRequest(
    status: FriendRequestStatus,
    friendRequestId: string,
  ) {
    const friendRequest = await this.getFriendRequestById(friendRequestId, {
      relations: ['creator', 'receiver'],
    });

    if (!friendRequest) {
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

    const users: IProfile[] = [];

    requests.forEach((request) => {
      if (request.creator.id === userId) {
        users.push({
          ...request.receiver,
          friendRequest: {
            status: request.status,
            id: request.id,
          },
        });
      } else if (request.receiver.id === userId) {
        users.push({
          ...request.creator,
          friendRequest: {
            status: request.status,
            id: request.id,
          },
        });
      }
    });

    return users;
  }

  async getUserIncomingFriendRequests(userId: string) {
    const requests = await this.friendRequestRepository.find({
      where: [
        {
          status: 'waiting-for-response',
          receiver: { id: userId },
        },
        {
          status: 'declined',
          receiver: { id: userId },
        },
      ],
      relations: ['creator', 'receiver'],
    });

    return requests.map((request) => ({
      ...request.creator,
      friendRequest: { id: request.id, status: 'waiting-for-response' },
    }));
  }

  async getSubscribedUsers(userId: string) {
    return await this.friendRequestRepository.find({
      where: {
        status: 'waiting-for-response',
        creator: { id: userId },
      },
      relations: ['receiver'],
    });
  }
}
