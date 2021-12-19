import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Profile } from '@/routes/profile/entities/profile.entity';

@Entity()
export class Posts extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created: Date;

  @Column({ type: 'simple-array' })
  likes: string[];

  @Column({ length: 512 })
  content: string;

  @ManyToOne(() => Profile, (profile) => profile.posts)
  @JoinColumn()
  profile: Profile;
}
