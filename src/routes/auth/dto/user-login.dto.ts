import { IsDefined } from 'class-validator';

export class UserLoginDto {
  @IsDefined({ message: 'required' })
  email: string;

  @IsDefined({ message: 'required' })
  password: string;
}
