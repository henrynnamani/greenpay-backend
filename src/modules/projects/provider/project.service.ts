import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CarbonProject } from '../schema/projects.schema';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import data from '@/modules/projects/data/projects.json';
import * as SYS_MSG from '@/shared/system-message';
import { CreateProjectDto } from '../dto/create-project.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(CarbonProject.name)
    private readonly projectModel: Model<CarbonProject>,
  ) {}

  async createProject(createProjectDto: CreateProjectDto) {
    try {
      const project = await this.projectModel.create(createProjectDto);

      return project.save();
    } catch (err) {
      throw new RequestTimeoutException(err);
    }
  }

  async fetchCarbonProjects() {
    return {
      message: SYS_MSG.PROJECT_LIST_FETCHED,
      data,
    };
  }
}
