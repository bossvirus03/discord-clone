import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IdentityService } from 'src/user/services/user-identity.service';
import { RegisterUserDto } from '../../lib/shared/dto/auth/register.dto';
import { UserService } from 'src/user/services/user.service';
import { compareSync, genSaltSync, hashSync } from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from 'lib/shared/type/jwt-payload.type';
import { env } from 'configs/env.configuration';

@Injectable()
export class AuthService {
  constructor(
    private identityService: IdentityService,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
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
    const saltRounds = env.jwt.SALT_ROUNDS;
    const salt = genSaltSync(Number(saltRounds));
    const hash = await hashSync(password, salt);
    return hash;
  }

  async validateUser(
    usernameOrEmail: string,
    pass: string,
  ): Promise<JwtPayload> {
    const userIdentity =
      await this.identityService.findByUsernameOrEmail(usernameOrEmail);
    const user = await this.userService.findOne(userIdentity.id);
    if (
      userIdentity &&
      (await this.validateUserPassword(usernameOrEmail, pass))
    ) {
      const { password, id, username, email } = userIdentity;
      const payload: JwtPayload = {
        sub: id,
        username,
        // email,
        role: user.role,
        userId: id,
      };
      return payload;
    }
    return null;
  }

  async decodeToken(token: string): Promise<JwtPayload> {
    return this.jwtService.decode(token);
  }

  async login(user: any) {
    const payload: JwtPayload = {
      role: user.role,
      userId: user.userId,
      username: user.username,
      // email: user.email,
      sub: user.userId,
    };
    return {
      userId: user.id,
      access_token: this.jwtService.sign(payload, {}),
    };
  }

  async register(user: RegisterUserDto) {
    const hashedPassword = await this.createHashPassword(user.password);
    user.password = hashedPassword;
    return this.userService.create(user);
  }
}
