import { IsNotEmpty, IsString } from 'class-validator';

export class CreateServerDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  iconUrl: string;
  badges: string[];
}
