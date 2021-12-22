import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hash } from 'bcrypt';
import { v4 } from 'uuid';

import { Users } from '@/routes/users/entities/users.entity';
import { UserCreateDto } from '@/routes/auth/dto/user-create.dto';
import { ProfileService } from '@/routes/profile/services/profile.service';
import { Profile } from '@/routes/profile/entities/profile.entity';
import { PostsService } from '@/routes/posts/services/posts.service';
import { FriendRequest } from '@/routes/users/entities/friend-request.entity';
import { IProfile } from '@/routes/profile/interfaces/profile.interface';
import { FriendRequestStatus } from '@/routes/users/interfaces/friend-request.interface';
import { FriendRequestService } from '@/routes/users/services/friend-request.service';
import { uuidRegex } from '@/constants/user';

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
    private readonly profileService: ProfileService,
    @Inject(forwardRef(() => PostsService))
    private readonly postsService: PostsService,
    private readonly friendRequestService: FriendRequestService,
  ) {}

  async getAllUsers(userId: string, query: string): Promise<IProfile[]> {
    const friends = await this.getFriends(userId);
    const users = (
      await (query
        ? this.profileService.getByQuery(query, userId, {
            relations: ['sentFriendRequests', 'receivedFriendRequests'],
          })
        : this.profileService.getAll(userId, {
            relations: ['sentFriendRequests', 'receivedFriendRequests'],
          }))
    ).filter((user) => !friends.find((friend) => user.id === friend.id));
    const currentUsers: IProfile[] = [];

    for (const user of users) {
      const friendRequests = await this.friendRequestService.getByIds([
        ...user.receivedFriendRequests.map(({ id }) => id),
        ...user.sentFriendRequests.map(({ id }) => id),
      ]);
      const friendRequest = friendRequests.find(
        (req) => userId === req.creator.id || userId === req.receiver.id,
      );

      if (friendRequest) {
        currentUsers.push({
          ...user,
          friendRequest: {
            id: friendRequest.id,
            status: getFriendRequestStatusByUser(
              userId === friendRequest.receiver.id ? 'receiver' : 'creator',
              friendRequest.status,
            ),
          },
        });

        continue;
      }

      currentUsers.push(user);
    }

    return currentUsers;
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

  async getUserByIdOrUsername(userId: string, id: string) {
    const profile = await this.profileService.getProfileInfo(id);
    const request = await this.friendRequestService.getFriendRequestByUsers(
      userId,
      profile.id,
    );

    return {
      ...profile,
      friendRequest: request,
    };
  }

  async getPostsById(
    page: number,
    limit: number,
    userId: string,
    requestedUserId: string,
  ) {
    return await this.postsService.getAll(page, limit, userId, requestedUserId);
  }

  async isRequestSentOrDeclined(
    creator: Profile,
    receiver: Profile,
  ): Promise<boolean> {
    return await this.friendRequestService.getIsRequestSent(creator, receiver);
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

    if (await this.isRequestSentOrDeclined(creator, receiver)) {
      throw new HttpException(
        'Request already had been sent or declined',
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      ...(await this.friendRequestService.createFriendRequest(
        creator,
        receiver,
      )),
      status: 'sent',
    };
  }

  async respondOnFriendRequest(
    status: FriendRequestStatus,
    friendRequestId: string,
    userId: string,
  ) {
    const friendRequest = await this.friendRequestService.getById(
      friendRequestId,
    );

    if (!friendRequest) {
      throw new HttpException(
        'No friend request find with the same id',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (
      status === 'waiting-for-response' &&
      userId === friendRequest.creator.id
    ) {
      return await this.friendRequestService.changeStatus(
        {
          ...friendRequest,
          creator: friendRequest.receiver,
          receiver: friendRequest.creator,
        },
        status,
      );
    }

    return await this.friendRequestService.changeStatus(friendRequest, status);
  }

  async getFriends(userId: string, query?: string) {
    const requests = await this.friendRequestService.getFriendsByUserId(userId);

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

    return query
      ? users.filter(
          (user) =>
            user.name.toLowerCase().includes(query.toLowerCase()) ||
            user.surname.toLowerCase().includes(query.toLowerCase()) ||
            user.username.toLowerCase().includes(query.toLowerCase()),
        )
      : users;
  }

  async getUserIncomingFriendRequests(userId: string) {
    const requests =
      await this.friendRequestService.getIncomingRequestsByUserId(userId);

    return requests.map((request) => ({
      ...request.creator,
      friendRequest: { id: request.id, status: 'waiting-for-response' },
    }));
  }

  async getSubscribedUsers(userId: string): Promise<FriendRequest[]> {
    return await this.friendRequestService.getSubscribedUsersByUserId(userId);
  }
}
