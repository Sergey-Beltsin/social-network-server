import { Profile } from '@/routes/profile/entities/profile.entity';
import { IConversation } from '@/routes/chat/interfaces/conversation.interface';

export interface IMessage {
  id?: string;
  message?: string;
  user?: Profile;
  conversation?: IConversation;
  created?: Date;
}
