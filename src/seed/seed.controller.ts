import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';
import { Course } from 'src/courses/models/courses.model';
import { seedDB } from './models/seedDB.model';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}


  @Get()
  runSEED(): Promise<seedDB> {
    const createdCoursesMsg = this.seedService.populateDB();
    return createdCoursesMsg;
  }

}
