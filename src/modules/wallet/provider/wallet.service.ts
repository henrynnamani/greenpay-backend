import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ethers } from 'ethers';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Wallet } from '../schema/wallet.schema';
import { randomBytes } from 'crypto';

@Injectable()
export class WalletService {
  constructor(@InjectModel(Wallet.name) private walletModel: Model<Wallet>) {}

  async getNonce(address: string): Promise<string> {
    const walletAddress = address.toLowerCase();
    const nonce = randomBytes(16).toString('hex');

    let wallet = await this.walletModel.findOne({ address: walletAddress });

    if (!wallet) {
      wallet = new this.walletModel({ address: walletAddress, nonce });
    } else {
      wallet.nonce = nonce;
    }

    await wallet.save();
    return nonce;
  }
}
