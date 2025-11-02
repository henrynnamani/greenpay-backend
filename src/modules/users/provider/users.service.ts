import {
  Injectable,
  NotFoundException,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/users.schema';
import { Model } from 'mongoose';
import * as SYS_MSG from '@/shared/system-message';
import { RegisterDto } from '@/modules/auth/dto/signup.dto';
import { WalletService } from '@/modules/wallet/provider/wallet.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly walletService: WalletService,
  ) {}

  async createUser(createUserDto: RegisterDto) {
    try {
      const user = await this.userModel.create(createUserDto);

      await this.walletService.createUserWallet(user);

      return user.save();
    } catch (err) {
      throw new RequestTimeoutException(err);
    }
  }

  async updateUserTotalEmission(id: string, emission: number) {
    try {
      await this.userModel.findByIdAndUpdate(id, {
        $inc: { totalEmissions: emission },
      });
    } catch (err) {
      throw new RequestTimeoutException(err);
    }
  }

  async findUserById(id: string) {
    try {
      const user = await this.userModel.findOne({
        _id: id,
      });

      if (!user) {
        throw new UnauthorizedException(SYS_MSG.INVALID_CREDENTIAL);
      }

      return user;
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
