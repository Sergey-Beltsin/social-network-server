import {
  IsDefined,
  IsEmail,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

import { passwordRegex } from '@/constants/user';
import { errors } from '@/constants/errors';

export class UserCreateDto {
  @IsEmail({}, { message: errors.pattern })
  @IsDefined({ message: errors.required })
  email: string;

  @MinLength(8, { message: errors.minLength })
  @MaxLength(20, { message: errors.maxLength })
  @IsDefined({ message: errors.required })
  @Matches(passwordRegex, { message: errors.pattern })
  password: string;

  @MinLength(4, { message: errors.minLength })
  @MaxLength(16, { message: errors.maxLength })
  @IsDefined({ message: errors.required })
  username: string;

  @MinLength(2, { message: errors.minLength })
  @MaxLength(30, { message: errors.maxLength })
  @IsDefined({ message: errors.required })
  name: string;

  @MinLength(2, { message: errors.minLength })
  @MaxLength(30, { message: errors.maxLength })
  @IsDefined({ message: errors.required })
  surname: string;
}
