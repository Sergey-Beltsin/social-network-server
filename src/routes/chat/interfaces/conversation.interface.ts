import { IProfile } from '@/routes/profile/interfaces/profile.interface';

export interface IConversation {
  id?: string;
  users: IProfile[];
  created?: Date;
}
