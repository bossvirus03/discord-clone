import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IdentityService } from 'src/user/services/user-identity.service';
import { RegisterUserDto } from './dto/register.dto';
import { UserService } from 'src/user/services/user.service';
import { compareSync, genSaltSync, hashSync } from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'lib/data-access/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private identityService: IdentityService,
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private prismaService: PrismaService,
  ) {}

  async validateUserPassword(
    usernameOrEmail: string,
    pass: string,
  ): Promise<boolean> {
    const user =
      await this.identityService.findByUsernameOrEmail(usernameOrEmail);
    const isValid = compareSync(pass, user.password);
    return isValid;
  }

  async createHashPassword(password: string): Promise<string> {
    const saltRounds = this.configService.get<number>('SALT_ROUND');
    const salt = genSaltSync(Number(saltRounds));
    const hash = await hashSync(password, salt);
    return hash;
  }

  async validateUser(usernameOrEmail: string, pass: string): Promise<any> {
    const user =
      await this.identityService.findByUsernameOrEmail(usernameOrEmail);
    if (user && (await this.validateUserPassword(usernameOrEmail, pass))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(user: RegisterUserDto) {
    const hashedPassword = await this.createHashPassword(user.password);
    user.password = hashedPassword;
    return this.userService.create(user);
  }
}
