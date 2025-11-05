import { Controller, Get } from '@nestjs/common';
import { ProjectService } from './provider/project.service';
import { CreateProjectDto } from './dto/create-project.dto';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectService) {}

  @Get()
  fetchCarbonProjects() {
    return this.projectsService.fetchCarbonProjects();
  }
}
