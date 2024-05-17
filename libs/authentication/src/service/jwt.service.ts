import { ConfigService } from '@nestjs/config';
import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { TokenDataDto } from '../dto/authentication.dto';

@Injectable()
export class JWTService {
  private expiresIn: string;
  private tokenSecret: string;
  private refreshTokenExpiration: string;
  private readonly logger = new Logger(JWTService.name);

  constructor(private readonly configService: ConfigService) {
    this.tokenSecret = configService.getOrThrow('TOKEN_SECRET');
  }

  signToken(tokenData: any): Promise<string> {
    return new Promise((resolve, reject) => {
      jwt.sign(
        tokenData,
        process.env.TOKEN_SECRET,
        // { expiresIn: 2 * 24 * 60 * 60 * 1000 },
        (err, encoded: string) => {
          if (err) reject(new InternalServerErrorException(err));
          resolve(encoded);
        },
      );
    });
  }

  verifyExpiredToken(token: string) {
    return new Promise((resolve, reject) => {
      jwt.verify(
        token,
        this.tokenSecret,
        { ignoreExpiration: true },
        (err, decoded) => {
          if (err) reject(new UnauthorizedException(err.message));
          resolve(decoded);
        },
      );
    });
  }

  refreshToken({
    id,
    expiresIn = this.refreshTokenExpiration,
  }: {
    id: string;
    expiresIn?: string;
  }): Promise<TokenDataDto> {
    return new Promise((resolve, reject) => {
      jwt.sign({ id }, this.tokenSecret, { expiresIn }, (err, decoded) => {
        if (err) reject(new InternalServerErrorException(err));

        resolve(decoded);
      });
    });
  }

  async verifyRefreshToken(token: string): Promise<TokenDataDto> {
    try {
      const decoded = await jwt.decode(token, this.tokenSecret);
      return decoded;
    } catch (err) {
      throw new UnauthorizedException(err);
    }
  }

  verifyToken(token: string): Promise<TokenDataDto> {
    return new Promise((resolve, reject) => {
      try {
        jwt.verify(token, this.tokenSecret, (err, decoded: any) => {
          if (err) {
            if (err.name === 'TokenExpiredError') {
              throw new HttpException(
                {
                  status: 451,
                  message: 'token expired',
                },
                451,
              );
            }
            throw new BadRequestException(err.message);
          }
          resolve(decoded);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  decode(token: string) {
    return jwt.decode(token, { complete: true });
  }
}
