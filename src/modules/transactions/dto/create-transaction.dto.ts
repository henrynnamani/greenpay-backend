import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { CategoryEnum } from '../schema/transaction.schema';

export class CreateTransactionDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
