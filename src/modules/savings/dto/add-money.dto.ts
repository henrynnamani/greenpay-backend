import { IsNotEmpty, IsNumber } from 'class-validator';

export class AddMoneyToSavingGoal {
  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
