import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RegisterUserDto } from '../../lib/shared/dto/auth/register.dto';
import { Public, User } from 'lib/shared/decorators/customize.decorator';
import { JwtPayload } from 'lib/shared/type/jwt-payload.type';
import { AuthLogoutRes, AuthRefreshRes, AuthSignInRes, AuthSignUpRes } from 'lib/shared/responses/auth/auth-response.type';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('login')
  async login(@Req() req: Request, @Res({ passthrough: true }) res): Promise<AuthSignInRes> {
    return this.authService.login(req.user as any, res);
  }

  @Post('register')
  @Public()
  async register(@Body() req: RegisterUserDto): Promise<AuthSignUpRes> {
    return this.authService.register(req);
  }

  @Public()
  @Post('logout')
  async logout(@Req() req, @Res({ passthrough: true }) res): Promise<AuthLogoutRes> {
    return this.authService.logout(req, res);
  }


  @Public()
  @Post('refresh')
  async refresh(@Req() req): Promise<AuthRefreshRes> {
    return this.authService.refresh(req);
  }
}
