import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../service/auth.service';
import { Auth } from '../model/auth.model';

@Injectable()
export class AuthCheckGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}
  async canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();

    const { username } = request.body as Auth;

    const auth = await this.authService.findOne({
      username: username.toLowerCase().trim(),
    });

    if (auth) {
      throw new BadRequestException(
        'username already exist, please try another one',
      );
    }

    return true;
  }
}
