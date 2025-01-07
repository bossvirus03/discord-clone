import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserIdentityDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
