import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  Logger,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JWTService } from '../service/jwt.service';
import { getToken } from '../function/authentication.function';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AuthMiddleware.name);
  constructor(private readonly jwtService: JWTService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const token = getToken(req);

      if (!token) {
        throw new BadRequestException('please provide a valid token');
      }
      const tokenData = await this.jwtService.verifyToken(token);

      if (!tokenData) {
        throw new BadRequestException('please provide a valid JWT token');
      }

      res.locals.tokenData = tokenData;
      next();
    } catch (error) {
      this.logger.error(error);
      throw new BadGatewayException(error.message);
    }
  }
}
