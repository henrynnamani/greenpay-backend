import {
  BadRequestException,
  Injectable,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { CreateSavingGoalDto } from '../dto/create-goal.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Saving } from '../schema/saving.schema';
import { Model } from 'mongoose';
import * as SYS_MSG from '@/shared/system-message';
import { UsersService } from '@/modules/users/provider/users.service';
import { DEDUCT_PURPOSE } from '@/constant';

@Injectable()
export class SavingsService {
  constructor(
    @InjectModel(Saving.name) private readonly savingModel: Model<Saving>,
    private readonly usersService: UsersService,
  ) {}

  async createSavingGoal(
    createSavingGoalDto: CreateSavingGoalDto,
    userId: string,
  ) {
    try {
      const goal = await this.savingModel.create({
        userId,
        ...createSavingGoalDto,
      });

      await goal.save();

      return {
        data: goal,
      };
    } catch (err) {
      throw new RequestTimeoutException(err);
    }
  }

  async getSavings(userId: string) {
    try {
      const [result] = await this.savingModel.aggregate([
        { $match: { userId } },
        {
          $facet: {
            stats: [
              {
                $group: {
                  _id: null,
                  totalSaved: { $sum: '$current' },
                  isActive: {
                    $sum: {
                      $cond: [{ $eq: ['$isActive', true] }, 1, 0],
                    },
                  },
                  averageProgress: {
                    $avg: {
                      $cond: [
                        { $gt: ['$target', 0] },
                        {
                          $multiply: [
                            { $divide: ['$current', '$target'] },
                            100,
                          ],
                        },
                        0,
                      ],
                    },
                  },
                },
              },
            ],
            records: [
              { $sort: { createdAt: -1 } }, // most recent first
            ],
          },
        },
        {
          $project: {
            totalSaved: {
              $ifNull: [{ $arrayElemAt: ['$stats.totalSaved', 0] }, 0],
            },
            active: { $ifNull: [{ $arrayElemAt: ['$stats.isActive', 0] }, 0] },
            averageProgress: {
              $ifNull: [{ $arrayElemAt: ['$stats.averageProgress', 0] }, 0],
            },
            records: 1,
          },
        },
      ]);

      return (
        result || {
          totalSaved: 0,
          active: 0,
          averageProgress: 0,
          records: [],
        }
      );
    } catch (err) {
      throw new RequestTimeoutException(err);
    }
  }

  async addMoney(id: string, amount: number, loggedInUser: any) {
    try {
      const goal = await this.savingModel.findOne({ _id: id });

      if (!goal) {
        throw new NotFoundException(SYS_MSG.SAVING_GOAL_NOT_FOUND);
      }

      if (!goal.isActive) {
        throw new BadRequestException(SYS_MSG.SAVING_GOAL_COMPLETED);
      }

      goal.current += amount;

      if (goal.current >= goal.target) {
        goal.isActive = false;
      }

      await this.usersService.deductUser(
        loggedInUser,
        amount,
        DEDUCT_PURPOSE.SAVING,
      );

      goal.save();

      return {
        message: SYS_MSG.SAVING_GOAL_UPDATED,
        data: goal,
      };
    } catch (err) {
      throw new RequestTimeoutException(err);
    }
  }
}
