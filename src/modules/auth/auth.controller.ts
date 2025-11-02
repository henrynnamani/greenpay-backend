import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/signup.dto';
import { UsersService } from '../users/provider/users.service';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as SYS_MSG from '@/shared/system-message';
import { LoginDto } from './dto/signin.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('signup')
  async signup(@Body() signupDto: RegisterDto) {
    const { password } = signupDto;

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userService.createUser({
      ...signupDto,
      password: hashedPassword,
    });

    const token = this.jwtService.sign(
      { id: user.id },
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

  @Post('signin')
  async signin(@Body() signinDto: LoginDto) {
    const { email, password } = signinDto;

    const user = await this.userService.findUserByEmail(email);

    const passwordMatch = await bcrypt.compare(password, user.password!);

    if (!passwordMatch) {
      throw new UnauthorizedException(SYS_MSG.INVALID_CREDENTIAL);
    }

    const token = this.jwtService.sign({ id: user.id });

    return { user, token };
  }
}
