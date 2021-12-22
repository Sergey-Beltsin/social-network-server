import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FriendRequest } from '@/routes/users/entities/friend-request.entity';
import { FriendRequestStatus } from '@/routes/users/interfaces/friend-request.interface';
import { Profile } from '@/routes/profile/entities/profile.entity';

@Injectable()
export class FriendRequestService {
  constructor(
    @InjectRepository(FriendRequest)
    private readonly friendRequestRepository: Repository<FriendRequest>,
  ) {}

  async getAll(): Promise<FriendRequest[]> {
    return await this.friendRequestRepository.find({
      relations: ['creator', 'receiver'],
    });
  }

  async getById(id: string): Promise<FriendRequest> {
    return await this.friendRequestRepository.findOne(id, {
      relations: ['creator', 'receiver'],
    });
  }

  async getByIds(ids: string[]): Promise<FriendRequest[]> {
    return await this.friendRequestRepository.findByIds(ids, {
      relations: ['creator', 'receiver'],
    });
  }

  async changeStatus(
    request: FriendRequest,
    status: FriendRequestStatus,
  ): Promise<FriendRequest> {
    return await this.friendRequestRepository.save({
      ...request,
      status,
    });
  }

  async getFriendsByUserId(userId: string): Promise<FriendRequest[]> {
    return await this.friendRequestRepository.find({
      where: [
        {
          creator: { id: userId },
          status: 'accepted',
        },
        { receiver: { id: userId }, status: 'accepted' },
      ],
      relations: ['creator', 'receiver'],
    });
  }

  async getIncomingRequestsByUserId(userId: string): Promise<FriendRequest[]> {
    return await this.friendRequestRepository.find({
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
  }

  async getSubscribedUsersByUserId(userId: string): Promise<FriendRequest[]> {
    return await this.friendRequestRepository.find({
      where: {
        status: 'waiting-for-response',
        creator: { id: userId },
      },
      relations: ['receiver'],
    });
  }

  async createFriendRequest(
    creator: Profile,
    receiver: Profile,
  ): Promise<FriendRequest> {
    return await this.friendRequestRepository.save({
      creator,
      receiver,
      status: 'waiting-for-response',
    });
  }

  async getIsRequestSent(
    creator: Profile,
    receiver: Profile,
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

  async getFriendRequestByUsers(
    creatorId: string,
    receiverId: string,
  ): Promise<FriendRequest> {
    return await this.friendRequestRepository.findOne({
      where: [
        { creator: { id: creatorId }, receiver: { id: receiverId } },
        { creator: { id: receiverId }, receiver: { id: creatorId } },
      ],
    });
  }
}
