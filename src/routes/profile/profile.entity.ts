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

@Entity()
export class Profile extends BaseEntity {
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
}
