import { Controller, Get, Post, Body, Param, Delete, ParseUUIDPipe, HttpException, HttpStatus, Query, ParseBoolPipe, Put } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentDto } from './dto/createEnrollment.dto';
import { UpdateEnrollmentDto } from './dto/updateEnrollment.dto';
import { Enrollment, enrollmentExpanded, enrollmentQueryParams } from './models/enrollments.interface';
import { PaginationDto } from 'src/courses/dto/pagination.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';

@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post()
  create(@Body() createEnrollmentDto: CreateEnrollmentDto) {
    const enrollment = this.enrollmentsService.create(createEnrollmentDto);
    return enrollment;
  }

  @Get()
  findAll(@Query('_expand', new ParseBoolPipe()) expanded: boolean, @Query() query: enrollmentQueryParams): Promise<Enrollment [] | enrollmentExpanded []> | Enrollment [] {

    const {_expand, ...rest} = query;
    const paginationDto: PaginationDto = rest;
    // console.log('Pagination Queries: ', paginationDto);
    if(expanded){
      const enrollmentsExpanded = this.enrollmentsService.findAllWithUserAndCourse(paginationDto);
      return enrollmentsExpanded;
    }else{
      const enrollments = this.enrollmentsService.findAll();
      return enrollments
    }
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe({version: '4'})) id: string) {
    const enrollment = this.enrollmentsService.findOne(id);
    return enrollment;
  }

  @Put(':id')
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
