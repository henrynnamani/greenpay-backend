import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectService } from './provider/project.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CarbonProject, CarbonProjectSchema } from './schema/projects.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CarbonProject.name, schema: CarbonProjectSchema },
    ]),
  ],
  controllers: [ProjectsController],
  providers: [ProjectService],
})
export class ProjectsModule {}
