import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { SavingsService } from './provider/savings.service';
import { CreateSavingGoalDto } from './dto/create-goal.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AddMoneyToSavingGoal } from './dto/add-money.dto';

@Controller('savings')
export class SavingsController {
  constructor(private readonly savingsService: SavingsService) {}

  @Post('')
  createSavingGoal(
    @Body() createSavingGoalDto: CreateSavingGoalDto,
    @CurrentUser() loggedInUser,
  ) {
    return this.savingsService.createSavingGoal(
      createSavingGoalDto,
      loggedInUser.sub,
    );
  }

  @Get('')
  getSavingGoals(@CurrentUser() loggedInUser) {
    return this.savingsService.getSavings(loggedInUser.sub);
  }

  @Put(':id')
  addMoneyToSavingGoal(
    @Param('id') id: string,
    @Body() addMoneyToSavingGoalDto: AddMoneyToSavingGoal,
    @CurrentUser() loggedInUser,
  ) {
    return this.savingsService.addMoney(
      id,
      addMoneyToSavingGoalDto.amount,
      loggedInUser.sub,
    );
  }
}
