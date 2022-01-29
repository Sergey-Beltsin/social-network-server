import { IsDefined, IsUUID, MaxLength } from 'class-validator';
import { IProfile } from '@/routes/profile/interfaces/profile.interface';

export class SendMessageDto {
  @MaxLength(100, { message: 'maxLength' })
  @IsDefined({ message: 'required' })
  message: string;

  @IsDefined({ message: 'required' })
  user: IProfile;

  @IsDefined({ message: 'required' })
  @IsUUID('4', { message: 'format' })
  conversationId: string;
}
