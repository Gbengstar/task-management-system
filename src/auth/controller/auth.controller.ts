import { AuthService } from './../service/auth.service';
import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ObjectValidationPipe } from '../../../libs/pipes/src';
import {
  changePasswordValidator,
  signUpValidator,
} from '../validator/auth.validator';
import { AuthDto, ChangePasswordDto } from '../dto/auth.dto';
import { HashService } from '../../../libs/utils/src/hash/hash.service';
import { TokenDataDto } from '../../../libs/authentication/src/dto/authentication.dto';
import { JWTService } from '../../../libs/authentication/src';
import { TokenDecorator } from '../../../libs/authentication/src/decorator/authentication.decorator';
import { AuthCheckGuard } from '../guard/sign-up.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JWTService,
  ) {}

  @Post('sign-up')
  // AuthCheckGuard check if username already exist
  @UseGuards(AuthCheckGuard)
  async signUp(
    @Body(new ObjectValidationPipe(signUpValidator))
    singUpData: AuthDto,
  ) {
    // hash password
    singUpData.password = await HashService.hash(singUpData.password);

    // create auth data and persist in the database
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
    @TokenDecorator() { id }: TokenDataDto,
    @Body(new ObjectValidationPipe(changePasswordValidator))
    { oldPassword, newPassword }: ChangePasswordDto,
  ) {
    const auth = await this.authService.findOneOrErrorOut({ _id: id });

    // check if old password is valid
    const isValidPassword = await HashService.verifyHash(
      auth.password,
      oldPassword,
    );

    if (!isValidPassword) {
      throw new BadRequestException('invalid credential');
    }

    auth.password = await HashService.hash(newPassword);

    await auth.save();
    return 'password changed successfully';
  }
}
