import { IsDefined, IsEmail, MaxLength, MinLength } from 'class-validator';

export class UserCreateDto {
  @IsEmail({}, { message: 'pattern' })
  @IsDefined({ message: 'required' })
  email: string;

  @MinLength(8, { message: 'minLength' })
  @MaxLength(20, { message: 'maxLength' })
  @IsDefined({ message: 'required' })
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
