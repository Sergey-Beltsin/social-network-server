import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Users } from '@/routes/users/entities/users.entity';
import { FriendRequestStatus } from '@/routes/users/interfaces/friend-request.interface';

@Entity()
export class FriendRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Users, (users) => users.sentFriendRequests)
  creator: Users;

  @ManyToOne(() => Users, (users) => users.receivedFriendRequests)
  receiver: Users;

  @Column()
  status: FriendRequestStatus;
}
