import {
  Body,
  Controller,
  Get,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/signup.dto';
import { UsersService } from '../users/provider/users.service';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as SYS_MSG from '@/shared/system-message';
import { LoginDto } from './dto/signin.dto';
import { SkipAuth } from './decorators/skip-auth.decorator';
import { CurrentUser } from './decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  @SkipAuth()
  @Post('signup')
  async signup(@Body() signupDto: RegisterDto) {
    const { password } = signupDto;

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userService.createUser({
      ...signupDto,
      password: hashedPassword,
    });

    const token = this.jwtService.sign(
      { sub: user.id },
      {
        secret: this.configService.get('jwt.secret'),
        expiresIn: this.configService.get('jwt.expires'),
      },
    );

    return {
      user,
      token,
    };
  }

  @SkipAuth()
  @Post('signin')
  async signin(@Body() signinDto: LoginDto) {
    const { email, password } = signinDto;

    const user = await this.userService.findUserByEmail(email);

    const passwordMatch = await bcrypt.compare(password, user.password!);

    if (!passwordMatch) {
      throw new UnauthorizedException(SYS_MSG.INVALID_CREDENTIAL);
    }

    const token = this.jwtService.sign({ sub: user.id });

    return { user, token };
  }

  @Post('wallet')
  async connectWallet() {}

  @Post('nonce')
  async generateNonce() {}

  @Get('me')
  async profile(@CurrentUser() loggedInUser) {
    return this.userService.userProfile(loggedInUser.sub);
  }
}
