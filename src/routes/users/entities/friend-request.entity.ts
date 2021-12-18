import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { FriendRequestStatus } from '@/routes/users/interfaces/friend-request.interface';
import { Profile } from '@/routes/profile/profile.entity';

@Entity()
export class FriendRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Profile, (profile) => profile.sentFriendRequests)
  creator: Profile;

  @ManyToOne(() => Profile, (profile) => profile.receivedFriendRequests)
  receiver: Profile;

  @Column()
  status: FriendRequestStatus;
}
