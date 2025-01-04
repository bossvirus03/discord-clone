import { Injectable } from '@nestjs/common';
import { UserService } from './user/services/user.service';

@Injectable()
export class AppService {
  constructor(private userService: UserService) {}
  getMe() {
    return this.userService.findAll();
  }
}
