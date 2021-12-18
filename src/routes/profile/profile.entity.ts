import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';

import { Posts } from '@/routes/posts/posts.entity';
import { IProfile } from '@/routes/profile/interfaces/profile.interface';
import { FriendRequest } from '@/routes/users/entities/friend-request.entity';

@Entity()
export class Profile extends BaseEntity implements IProfile {
  @PrimaryColumn('uuid')
  id: string;

  @CreateDateColumn()
  created: Date;

  @Column()
  bio: string;

  @Column({ nullable: false, unique: true })
  username: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  surname: string;

  @OneToMany(() => Posts, (post) => post.profile)
  @JoinColumn()
  posts: Posts[];

  @OneToMany(() => FriendRequest, (friendRequest) => friendRequest.creator)
  sentFriendRequests: FriendRequest[];

  @OneToMany(() => FriendRequest, (friendRequest) => friendRequest.receiver)
  receivedFriendRequests: FriendRequest[];
}
