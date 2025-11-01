import { Body, Controller, Post } from '@nestjs/common';
import { ProjectService } from './provider/project.service';
import { CreateProjectDto } from './dto/create-project.dto';

@Controller('projects')
export class ProjectsController {
    constructor(
        private readonly projectsService: ProjectService
    ) {}

    @Post()
    createProject(@Body() projectDto: CreateProjectDto) {
        return this.projectsService.create(projectDto)
    }
}
