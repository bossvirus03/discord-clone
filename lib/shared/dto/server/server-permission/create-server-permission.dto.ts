import { IsNotEmpty, IsString } from 'class-validator';

export class CreateServerPermissionDto {
    @IsString()
    @IsNotEmpty()
    name: string;
    @IsString()
    @IsNotEmpty()
    url: string;
    userId: string;
    serverId: string;
}
