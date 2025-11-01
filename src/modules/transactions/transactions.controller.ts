import { Body, Controller, Get, Post } from '@nestjs/common';
import { TransactionsService } from './provider/transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionService: TransactionsService) {}

  @Post('')
  createTransaction(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionService.create(createTransactionDto);
  }

  @Get('')
  getTransactions() {
    return this.transactionService.findUserTransactions(
      '69059e41ec545037e44ae327',
    );
  }
}
