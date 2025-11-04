import { Body, Controller, Get, Post } from '@nestjs/common';
import { TransactionsService } from './provider/transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionService: TransactionsService) {}

  @Post('')
  createTransaction(
    @Body() createTransactionDto: CreateTransactionDto,
    @CurrentUser() loggedInUser,
  ) {
    return this.transactionService.create(
      createTransactionDto,
      loggedInUser.sub,
    );
  }

  @Get('')
  getTransactions(@CurrentUser() loggedInUser) {
    return this.transactionService.getTransactions(loggedInUser.sub);
  }
}
