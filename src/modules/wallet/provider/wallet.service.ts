import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Wallet } from '../schema/wallet.schema';
import { User } from '@/modules/users/schemas/users.schema';
import * as SYS_MSG from '@/shared/system-message';

@Injectable()
export class WalletService {
  constructor(@InjectModel(Wallet.name) private walletModel: Model<Wallet>) {}

  async createUserWallet(user: User) {
    try {
      const wallet = await this.walletModel.create({
        userId: user._id,
      });

      return wallet;
    } catch (err) {
      throw new RequestTimeoutException(err);
    }
  }

  async connectWallet(userId: String, address: string) {
    try {
      let wallet = await this.walletModel.findOne({ userId });

      if (!wallet) {
        wallet = await this.walletModel.create({ userId, address });
      } else {
        wallet.address = address;
        await wallet.save();
      }

      return {
        message: SYS_MSG.WALLET_CONNECTED_SUCCESSFULLY,
        wallet,
      };
    } catch (err) {
      throw new RequestTimeoutException(err);
    }
  }
}
