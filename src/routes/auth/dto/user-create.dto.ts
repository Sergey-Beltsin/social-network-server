import { IsDefined, IsEmail, MaxLength, MinLength } from 'class-validator';

export class UserCreateDto {
  @IsEmail({}, { message: 'invalidEmail' })
  @IsDefined({ message: 'empty' })
  email: string;

  @MinLength(8, { message: 'minLength' })
  @MaxLength(20, { message: 'maxLength' })
  @IsDefined({ message: 'empty' })
  password: string;

  @MinLength(4, { message: 'minLength' })
  @MaxLength(16, { message: 'maxLength' })
  @IsDefined({ message: 'empty' })
  username: string;

  @MinLength(2, { message: 'minLength' })
  @MaxLength(30, { message: 'maxLength' })
  @IsDefined({ message: 'empty' })
  name: string;

  @MinLength(2, { message: 'minLength' })
  @MaxLength(30, { message: 'maxLength' })
  @IsDefined({ message: 'empty' })
  surname: string;
}
