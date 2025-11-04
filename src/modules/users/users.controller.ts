import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './provider/users.service';
import { AddMoneyDto } from './dto/add-money.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('balance')
  addMoney(@Body() addMoneyDto: AddMoneyDto, @CurrentUser() loggedInUser) {
    return this.usersService.addMoney(addMoneyDto, loggedInUser);
  }

  
}
