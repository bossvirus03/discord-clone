import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDirectMessageDto {
  @IsString()
  @IsNotEmpty()
  receiverId: string;

  @IsNotEmpty()
  @IsString()
  senderId: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}

export class CreateServerMessageDto {
  @IsString()
  @IsNotEmpty()
  serverId: string;

  @IsNotEmpty()
  @IsString()
  senderId: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
