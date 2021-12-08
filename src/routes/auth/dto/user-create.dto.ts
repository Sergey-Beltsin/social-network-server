import {
  IsDefined,
  IsEmail,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

import { passwordRegex } from '@/constants/user';

export class UserCreateDto {
  @IsEmail({}, { message: 'pattern' })
  @IsDefined({ message: 'required' })
  email: string;

  @MinLength(8, { message: 'minLength' })
  @MaxLength(20, { message: 'maxLength' })
  @IsDefined({ message: 'required' })
  @Matches(passwordRegex, { message: 'pattern' })
  password: string;

  @MinLength(4, { message: 'minLength' })
  @MaxLength(16, { message: 'maxLength' })
  @IsDefined({ message: 'required' })
  username: string;

  @MinLength(2, { message: 'minLength' })
  @MaxLength(30, { message: 'maxLength' })
  @IsDefined({ message: 'required' })
  name: string;

  @MinLength(2, { message: 'minLength' })
  @MaxLength(30, { message: 'maxLength' })
  @IsDefined({ message: 'required' })
  surname: string;
}
