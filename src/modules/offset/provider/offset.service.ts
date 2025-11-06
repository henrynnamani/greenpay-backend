import { Body, forwardRef, Inject, Injectable, RequestTimeoutException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Offset } from '../schema/offset.schema';
import { Model } from 'mongoose';
import { OffsetProjectDto } from '../dto/offset-project';
import { CurrentUser } from '@/modules/auth/decorators/current-user.decorator';
import { UsersService } from '@/modules/users/provider/users.service';
import { DEDUCT_PURPOSE } from '@/constant';

@Injectable()
export class OffsetService {
  constructor(
    @InjectModel(Offset.name) private readonly offsetModel: Model<Offset>,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
  ) {}

  async offsetProject(offsetProjectDto: OffsetProjectDto, userId: string) {
    try {
      await this.userService.deductUser(
        userId,
        offsetProjectDto.amount,
        DEDUCT_PURPOSE.OFFSET,
        offsetProjectDto.offsetAmount,
      );

      const offset = await this.offsetModel.create({
        userId,
        ...offsetProjectDto,
      });

      return offset.save();
    } catch (err) {
      throw new RequestTimeoutException(err);
    }
  }

  async getOffsets(userId: string) {
    try {
      const projects = await this.offsetModel.find({ userId });

      return projects;
    } catch (err) {
      throw new RequestTimeoutException(err);
    }
  }

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
