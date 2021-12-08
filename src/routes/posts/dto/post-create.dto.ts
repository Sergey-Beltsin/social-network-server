import { IsDefined, MaxLength } from 'class-validator';

import { errors } from '@/constants/errors';

export class PostCreateDto {
  @MaxLength(512, { message: errors.maxLength })
  @IsDefined({ message: errors.required })
  content: string;
}
