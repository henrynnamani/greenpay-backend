import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { InjectModel } from '@nestjs/mongoose';
import { CategoryEnum, Transaction } from '../schema/transaction.schema';
import { Model } from 'mongoose';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name)
    private readonly transactionModel: Model<Transaction>,
  ) {}

  private emissionFactor = {
    transport: 0.34,
    energy: 0.32,
    food: 0.96,
  };

  async create(transactionDto: CreateTransactionDto) {
    try {
      const estimatedEmission = 1.5;
      const payload = {
        userId: '69059e41ec545037e44ae327',
        category: CategoryEnum.FOOD,
        estimatedEmission,
        ...transactionDto,
      };

      const transaction = await this.transactionModel.create(payload);

      return transaction.save();
    } catch (err) {
      throw new RequestTimeoutException(err);
    }
  }

  async findUserTransactions(userId: string) {
    return this.transactionModel.find({ userId }).sort({ createdAt: -1 }).exec();
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
