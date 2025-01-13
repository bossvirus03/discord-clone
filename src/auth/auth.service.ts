import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IdentityService } from 'src/user/services/user-identity.service';
import { RegisterUserDto } from '../../lib/shared/dto/auth/register.dto';
import { UserService } from 'src/user/services/user.service';
import { compareSync, genSaltSync, hashSync } from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from 'lib/shared/type/jwt-payload.type';
import envConfiguration, { env } from 'configs/env.configuration';
import { Request, Response } from 'express';
import { PrismaService } from 'lib/data-access/prisma/prisma.service';
import { createHashPassword } from 'lib/helper';

@Injectable()
export class AuthService {
  constructor(
    private identityService: IdentityService,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) { }

  async validateUserPassword(
    usernameOrEmail: string,
    pass: string,
  ): Promise<boolean> {
    const user =
      await this.identityService.findByUsernameOrEmail(usernameOrEmail);
    const isValid = compareSync(pass, user.password);
    return isValid;
  }

  async verifyToken(token: string, isRefresh: boolean) {
    const secret = isRefresh ? env.jwt.JWT_REFRESH_TOKEN_SECRET : env.jwt.JWT_ACCESS_TOKEN_SECRET
    return await this.jwtService.verifyAsync(token, {
      secret: secret
    })
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

  async login(user: JwtPayload, res: Response) {
    const payload: JwtPayload = {
      role: user.role,
      userId: user.userId,
      username: user.username,
      // email: user.email,
      sub: user.userId,
    };

    const refreshToken = await this.processRefreshToken(payload);
    res.cookie("refresh_token", refreshToken);
    await this.prisma.token.create({
      data: {
        refreshToken: refreshToken,
        identityId: user.userId
      }
    })
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: refreshToken
    };
  }

  async processRefreshToken(payload: JwtPayload) {
    return await this.jwtService.signAsync(payload, {
      secret: env.jwt.JWT_REFRESH_TOKEN_SECRET,
      expiresIn: env.jwt.JWT_REFRESH_TOKEN_EXPIRE
    })
  }

  async register(user: RegisterUserDto) {
    const hashedPassword = await createHashPassword(user.password);
    user.password = hashedPassword;
    return this.userService.create(user);
  }

  async logout(req: Request, res: Response) {
    const token = await this.prisma.token.delete({ where: { refreshToken: req.cookies['refresh_token'] } })
    res.clearCookie('refresh_token')
  }

  async refresh(req: Request) {
    //todo
    try {
      const refresh = req.cookies['refresh_token']
      const payload = await this.verifyToken(refresh, true)
      return {
        userId: payload.userId,
        access_token: this.jwtService.sign(payload),
        refresh_token: refresh
      };
    } catch (error) {
      // throw 
    }

  }
}
