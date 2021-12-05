import { IsDefined } from 'class-validator';

export class UserLoginDto {
  @IsDefined({ message: 'empty' })
  email: string;

  @IsDefined({ message: 'empty' })
  password: string;
}
