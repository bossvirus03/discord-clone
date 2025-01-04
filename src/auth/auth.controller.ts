import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RegisterUserDto } from './dto/register.dto';
import { Public } from 'lib/shared/decorators/customize.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('login')
  async login(@Req() req: Request) {
    return this.authService.login(req.user);
  }

  @Post('register')
  @Public()
  async register(@Body() req: RegisterUserDto) {
    return this.authService.register(req);
  }

  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('logout')
  async logout(@Req() req) {
    return req.logout();
  }
}
