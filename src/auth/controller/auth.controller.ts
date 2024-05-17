import { AuthService } from './../service/auth.service';
import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { ObjectValidationPipe } from '../../../libs/pipes/src';
import { signUpValidator } from '../validator/auth.validator';
import { AuthDto } from '../dto/auth.dto';
import { HashService } from '../../../libs/utils/src/hash/hash.service';
import { TokenDataDto } from '../../../libs/authentication/src/dto/authentication.dto';
import { JWTService } from '../../../libs/authentication/src';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JWTService,
  ) {}

  @Post('sign-up')
  async signUp(
    @Body(new ObjectValidationPipe(signUpValidator))
    singUpData: AuthDto,
  ) {
    singUpData.password = await HashService.hash(singUpData.password);
    const { username } = await this.authService.create(singUpData);
    return { username };
  }

  @Post('login')
  async login(
    @Body(new ObjectValidationPipe(signUpValidator))
    { username, password }: AuthDto,
  ) {
    const auth = await this.authService.findOneOrErrorOut({ username });
    const isValidPassword = await HashService.verifyHash(
      auth.password,
      password,
    );

    if (!isValidPassword) {
      throw new UnauthorizedException('username or password is invalid');
    }
    const tokenData: TokenDataDto = {
      id: auth._id.toString(),
      username: auth.username,
    };

    const accessToken = await this.jwtService.signToken(tokenData);
    return { accessToken, username: auth.username };
  }

  @Post('change-password')
  async changePassword(
    @Body(new ObjectValidationPipe(signUpValidator))
    singUpData: AuthDto,
  ) {
    singUpData.password = await HashService.hash(singUpData.password);
    const auth = await this.authService.create(singUpData);
    return auth;
  }

  @Post('forget-password')
  async forgetPassword(
    @Body(new ObjectValidationPipe(signUpValidator))
    singUpData: AuthDto,
  ) {
    singUpData.password = await HashService.hash(singUpData.password);
    const auth = await this.authService.create(singUpData);
    return auth;
  }
}
