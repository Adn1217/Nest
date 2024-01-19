import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, HttpException, HttpStatus } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentDto } from './dto/createEnrollment.dto';
import { UpdateEnrollmentDto } from './dto/updateEnrollment.dto';

@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post()
  create(@Body() createEnrollmentDto: CreateEnrollmentDto) {
    const enrollment = this.enrollmentsService.create(createEnrollmentDto);
    return enrollment;
  }

  @Get()
  findAll() {
    const enrollments = this.enrollmentsService.findAll();
    return enrollments
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe({version: '4'})) id: string) {
    const enrollment = this.enrollmentsService.findOne(id);
    return enrollment;
  }

  @Patch(':id')
  update(@Param('id', new ParseUUIDPipe({version: '4'})) id: string, @Body() updateEnrollmentDto: UpdateEnrollmentDto) {
    if (Object.keys(updateEnrollmentDto).length === 0){
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: `No se encuentra información en el payload`,
      }, HttpStatus.BAD_REQUEST)
    }

    const updatedEnrollment = this.enrollmentsService.update(id, updateEnrollmentDto);
    return updatedEnrollment;
  }

  @Delete(':id')
  delete(@Param('id', new ParseUUIDPipe({version: '4'})) id: string) {
    const deletedEnrollment = this.enrollmentsService.delete(id);
    return deletedEnrollment;
  }
}
