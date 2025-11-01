import {
  BadRequestException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { CreateProjectDto } from '../dto/create-project.dto';
import { InjectModel } from '@nestjs/mongoose';
import { CarbonProject } from '../schema/projects.schema';
import { Model } from 'mongoose';
import * as SYS_MSG from '@/shared/system-message';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(CarbonProject.name)
    private readonly projectModel: Model<CarbonProject>,
  ) {}
  async create(projectDto: CreateProjectDto) {
    try {
      const existingProject = await this.projectExist(projectDto.name);

      if (existingProject) {
        throw new BadRequestException(SYS_MSG.PROJECT_ALREADY_EXIST);
      }

      const project = await this.projectModel.create(projectDto);

      return project.save();
    } catch (err) {
      throw new RequestTimeoutException(err);
    }
  }

  async projectExist(name: string) {
    try {
      const project = this.projectModel.findOne({
        name,
      });

      return project;
    } catch (err) {
      throw new RequestTimeoutException(err);
    }
  }
}
