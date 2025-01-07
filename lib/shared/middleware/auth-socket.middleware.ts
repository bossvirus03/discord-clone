import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { env } from 'configs/env.configuration';
import { JwtPayload } from 'lib/shared/type/jwt-payload.type';
import { Socket } from 'socket.io';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
// import { UserService } from 'src/user/services/user.service';

export type SocketMiddleware = (
  socket: Socket,
  next: (err?: Error) => void,
) => void;

export const SocketAuthMiddleware = (
  jwtService: JwtService,
  configService: ConfigService,
  //   userService: UserService,
): SocketMiddleware => {
  return async (socket: Socket, next) => {
    try {
      const { authorization } = socket.handshake.headers;
      // console.log('auth mw >>>', authorization);

      const token = authorization?.split(' ')[1];
      if (!token) {
        throw new Error('Authorization token is missing');
      }

      let payload: JwtPayload | null = null;

      try {
        payload = await jwtService.verifyAsync<JwtPayload>(token, {
          secret: env.jwt.JWT_ACCESS_TOKEN_SECRET,
        });
      } catch (error) {
        throw new Error('Authorization token is invalid');
      }

      const strategy = new JwtStrategy(configService);
      const user = await strategy.validate(payload);

      if (!user) {
        throw new Error('User does not exist');
      }

      socket = Object.assign(socket, {
        user: user!,
      });
      next();
    } catch (error) {
      console.log('Error', error);
      next(new Error('Unauthorized'));
    }
  };
};
