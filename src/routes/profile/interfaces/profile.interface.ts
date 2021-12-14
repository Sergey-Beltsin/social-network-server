import { Posts } from '@/routes/posts/posts.entity';

export interface IProfile {
  id: string;
  created: Date;
  bio: string;
  username: string;
  name: string;
  surname: string;
  posts: Posts[];
}
