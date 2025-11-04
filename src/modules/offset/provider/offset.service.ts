import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Offset } from '../schema/offset.schema';
import { Model } from 'mongoose';

@Injectable()
export class OffsetService {
  constructor(
    @InjectModel(Offset.name) private readonly offsetModel: Model<Offset>,
  ) {}

  async aggregateMonthlyOffset(id: string, startOfMonth: any, endOfMonth: any) {
    return await this.offsetModel.aggregate([
      {
        $match: {
          userId: id,
          createdAt: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      {
        $group: {
          _id: null,
          totalOffset: { $sum: '$amount' },
        },
      },
    ]);
  }
}
