import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';

import { Posts } from '@/routes/posts/entities/posts.entity';
import { IProfile } from '@/routes/profile/interfaces/profile.interface';
import { FriendRequest } from '@/routes/users/entities/friend-request.entity';
import { Conversation } from '@/routes/chat/entities/conversation.entity';
import { Message } from '@/routes/chat/entities/message.entity';

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

  @Column({ nullable: true })
  isOnline?: boolean;

  @Column({ nullable: true })
  lastOnline?: Date;

  @OneToMany(() => Posts, (post) => post.profile)
  @JoinColumn()
  posts: Posts[];

  @OneToMany(() => FriendRequest, (friendRequest) => friendRequest.creator)
  sentFriendRequests: FriendRequest[];

  @OneToMany(() => FriendRequest, (friendRequest) => friendRequest.receiver)
  receivedFriendRequests: FriendRequest[];

  @ManyToMany(() => Conversation, (conversation) => conversation.users)
  conversations: Conversation[];

  @OneToMany(() => Message, (message) => message.user)
  messages: Message[];
}
