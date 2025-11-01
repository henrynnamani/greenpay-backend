import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './provider/auth.service';
import { AuthDto } from './dto/signup.dto';
import { UsersService } from '../users/provider/users.service';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as SYS_MSG from '@/shared/system-message';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('signup')
  async signup(@Body() signupDto: AuthDto) {
    const { email, password } = signupDto;

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userService.createUser({
      email,
      password: hashedPassword,
    });

    await user.save();

    const token = this.jwtService.sign(
      { id: user.id },
      {
        secret: this.configService.get('jwt.secret'),
        expiresIn: this.configService.get('jwt.expires'),
      },
    );

    return {
      token,
    };
  }

  @Post('signin')
  async signin(@Body() signinDto: AuthDto) {
    const { email, password } = signinDto;

    const user = await this.userService.findUserByEmail(email);

    const passwordMatch = await bcrypt.compare(password, user.password!);

    if (!passwordMatch) {
      throw new UnauthorizedException(SYS_MSG.INVALID_CREDENTIAL);
    }

    const token = this.jwtService.sign({ id: user.id });

    return { token };
  }
}
