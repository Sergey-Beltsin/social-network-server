import {
  BaseEntity,
  CreateDateColumn,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  JoinTable,
  Entity,
  UpdateDateColumn,
} from 'typeorm';

import { Profile } from '@/routes/profile/entities/profile.entity';
import { Message } from '@/routes/chat/entities/message.entity';

@Entity()
export class Conversation extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToMany(() => Profile)
  @JoinTable()
  users: Profile[];

  @OneToMany(() => Message, (message) => message.conversation)
  messages: Message[];

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  lastUpdated: Date;
}
