import { IProfile } from '@/routes/profile/interfaces/profile.interface';
import { IMessage } from '@/routes/chat/interfaces/message.interface';

export interface IConversation {
  id?: string;
  users: IProfile[];
  messages?: IMessage[];
  created?: Date;
}
