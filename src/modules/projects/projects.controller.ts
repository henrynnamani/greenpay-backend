import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProjectService } from './provider/project.service';
import { CreateProjectDto } from './dto/create-project.dto';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectService) {}

  @Post('')
  createProject(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.createProject(createProjectDto);
  }

  @Get()
  fetchCarbonProjects() {
    return this.projectsService.fetchCarbonProjects();
  }
}
