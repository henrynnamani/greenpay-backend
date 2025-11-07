import { Body, Controller, Get, Put } from '@nestjs/common';
import { OffsetService } from './provider/offset.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { OffsetProjectDto } from './dto/offset-project';

@Controller('offset')
export class OffsetController {
  constructor(
    private readonly offsetService: OffsetService) {}

  @Get('')
  getOffsets(@CurrentUser() loggedInUser) {
    return this.offsetService.getOffsets(loggedInUser.sub);
  }

  @Put('')
  offsetProject(
    @Body() offsetProjectDto: OffsetProjectDto,
    @CurrentUser() loggedInUser,
  ) {
    return this.offsetService.offsetProject(offsetProjectDto, loggedInUser.sub);
  }
}
