import { IsNotEmpty, IsString } from 'class-validator';

export class CreateServerPermissionDto {
    @IsString()
    @IsNotEmpty()
    name: string;
    @IsString()
    @IsNotEmpty()
    apiPath: string;
    @IsString()
    @IsNotEmpty()
    method: string;
    @IsString()
    @IsNotEmpty()
    description: string;
    @IsString()
    @IsNotEmpty()
    serverId: string;
}
