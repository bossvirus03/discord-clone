import { UserRole } from '@discord-clone/DiscordClone';
import { IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
    avatarUrl: string
    badges: string[]
    @IsNotEmpty()
    name: string
    @IsNotEmpty()
    role: UserRole
}
