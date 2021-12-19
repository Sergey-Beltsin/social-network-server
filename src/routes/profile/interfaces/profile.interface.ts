import { Posts } from '@/routes/posts/entities/posts.entity';
import { FriendRequestStatus } from '@/routes/users/interfaces/friend-request.interface';

export interface IProfile {
  id: string;
  created: Date;
  bio: string;
  username: string;
  name: string;
  surname: string;
  posts: Posts[];
  friendRequest?: {
    status: FriendRequestStatus;
    id: string;
  };
}
