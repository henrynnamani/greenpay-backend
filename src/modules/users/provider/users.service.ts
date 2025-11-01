import {
  Injectable,
  NotFoundException,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/users.schema';
import { Model } from 'mongoose';
import { AuthDto } from '@/modules/auth/dto/signup.dto';
import * as SYS_MSG from '@/shared/system-message';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(createUserDto: AuthDto) {
    try {
      const user = await this.userModel.create(createUserDto);

      return user.save();
    } catch (err) {
      throw new RequestTimeoutException(err);
    }
  }

  async findUserByEmail(email: string) {
    try {
      const user = await this.userModel.findOne({
        email,
      });

      if (!user) {
        throw new UnauthorizedException(SYS_MSG.INVALID_CREDENTIAL);
      }

      return user;
    } catch (err) {
      throw new RequestTimeoutException(err);
    }
  }
}
