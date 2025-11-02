import {
  BadRequestException,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Transaction } from '../schema/transaction.schema';
import { Model } from 'mongoose';
import { AiProvider } from '@/modules/ai/ai.interface';
import { UsersService } from '@/modules/users/provider/users.service';
import { User } from '@/modules/users/schemas/users.schema';
import * as SYS_MSG from '@/shared/system-message';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name)
    private readonly transactionModel: Model<Transaction>,
    @Inject('AI_PROVIDER') private readonly aiProvider: AiProvider,
    private readonly usersService: UsersService,
  ) {}

  async create(transactionDto: CreateTransactionDto) {
    try {
      const userId = '69059e41ec545037e44ae327';
      const user = await this.usersService.findUserById(userId);

      await this.checkSufficientBalance(user, transactionDto.amount);

      const aiResponse = await this.aiProvider.analyzeTransaction(
        transactionDto.description,
        transactionDto.amount,
        'USD',
      );

      const payload = {
        userId,
        category: aiResponse.category,
        merchant: aiResponse.merchant,
        amount: Number(transactionDto.amount),
        estimatedEmission: aiResponse.estimatedEmissionKg,
        recipient: transactionDto.recipient,
      };

      const transaction = await this.transactionModel.create(payload);

      await this.usersService.updateUserTotalEmission(
        userId,
        payload.estimatedEmission,
      );

      return transaction.save();
    } catch (err) {
      throw new RequestTimeoutException(err);
    }
  }

  async findUserTransactions(userId: string) {
    return this.transactionModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async checkSufficientBalance(user: User, amount: number): Promise<boolean> {
    try {
      if (user.totalBalance! < amount) {
        throw new BadRequestException(SYS_MSG.INSUFFICIENT_FUND);
      }

      return true;
    } catch (err) {
      throw new RequestTimeoutException(err);
    }
  }

  //   async getUserCarbonSummary(userId: string) {
  //     const txs = await this.transactionModel.find({ userId });
  //     const totalCO2 = txs.reduce((sum, tx) => sum + (tx.carbonEstimate || 0), 0);
  //     const totalSpent = txs.reduce((sum, tx) => sum + tx.amount, 0);

  //     return {
  //       totalSpent,
  //       totalCO2,
  //       avgCO2PerDollar: totalSpent ? totalCO2 / totalSpent : 0,
  //     };
  //   }
}
