import {
  BadRequestException,
  forwardRef,
  Inject,
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
import { AddMoneyDto } from '../dto/add-money.dto';
import { TransactionsService } from '@/modules/transactions/provider/transactions.service';
import { OffsetService } from '@/modules/offset/provider/offset.service';
import { DEDUCT_PURPOSE } from '@/constant';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly walletService: WalletService,
    @Inject(forwardRef(() => TransactionsService))
    private readonly transactionService: TransactionsService,
    private readonly offsetService: OffsetService,
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

  async userProfile(id: string) {
    try {
      const startOfMonth = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1,
      );
      const endOfMonth = new Date();

      const [transactionStats] =
        await this.transactionService.aggregateMonthlyTransaction(
          id,
          startOfMonth,
          endOfMonth,
        );

      const [offsetStats] = await this.offsetService.aggregateMonthlyOffset(
        id,
        startOfMonth,
        endOfMonth,
      );

      const user = await this.userModel
        .findOne({ _id: id })
        .populate('transactions')
        .select('-password')
        .lean();

      return {
        data: {
          ...user,
          monthlySummary: {
            totalAmount: transactionStats?.totalAmount || 0,
            totalEmission: transactionStats?.totalEmissions || 0,
            offset: offsetStats?.totalOffset || 0,
          },
        },
      };
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

  async addMoney(addMoneyDto: AddMoneyDto, loggedInUser) {
    const session = await this.userModel.startSession();

    session.startTransaction();
    try {
      const user = await this.userModel.findOneAndUpdate(
        { _id: loggedInUser.sub },
        {
          $inc: { totalBalance: addMoneyDto.amount },
        },
        { new: true, session, lean: true },
      );

      if (!user) {
        throw new NotFoundException(SYS_MSG.USER_NOT_FOUND);
      }

      await session.commitTransaction();

      return {
        message: SYS_MSG.BALANCE_UPDATED_SUCCESSFULLY,
        data: user,
      };
    } catch (err) {
      await session.abortTransaction();
      throw new RequestTimeoutException(err);
    } finally {
      await session.endSession();
    }
  }

  async deductUser(id: string, amount: number, purpose: string) {
    const session = await this.userModel.startSession();

    try {

      (await session).startTransaction();

      const user = await this.userModel.findOne({ _id: id }).session(session);

      if (!user) {
        throw new NotFoundException(SYS_MSG.USER_NOT_FOUND);
      }

      switch (purpose) {
        case DEDUCT_PURPOSE.SAVING:
          user.totalBalance! -= Math.abs(amount);
          user!.totalSaved += Math.abs(amount);
          break;

        case DEDUCT_PURPOSE.TRANSACTION:
          user.totalBalance! -= Math.abs(amount);
          break;
        default:
          throw new BadRequestException(`Invalid purpose: ${purpose}`);
      }

      await user.save({ session });

      await session.commitTransaction();
      session.endSession();

      return user;
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw new RequestTimeoutException(err);
    }
  }
}
