import { IsDefined } from 'class-validator';

import { errors } from '@/constants/errors';

export class UserLoginDto {
  @IsDefined({ message: errors.required })
  email: string;

  @IsDefined({ message: errors.required })
  password: string;
}
