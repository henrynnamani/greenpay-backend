import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CarbonProject } from '../schema/projects.schema';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import data from '@/modules/projects/data/projects.json';
import * as SYS_MSG from '@/shared/system-message';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(CarbonProject.name)
    private readonly projectModel: Model<CarbonProject>,
    private readonly configService: ConfigService,
  ) {}

  async fetchCarbonProjects() {
    return {
      message: SYS_MSG.PROJECT_LIST_FETCHED,
      data,
    };
  }
}
