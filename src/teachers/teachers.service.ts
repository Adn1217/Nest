import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTeacherDto } from './dto/createTeacher.dto';
import { UpdateTeacherDto } from './dto/updateTeacher.dto';
import { v4 as uuid } from 'uuid';
import { Teacher } from './models/teachers.model'



@Injectable()
export class TeachersService {

  private teachers: Teacher [] = [];

  create(createTeacherDto: CreateTeacherDto) : Teacher {
    const newTeacher = {
      id: uuid(), 
      ...createTeacherDto,
      edad: +createTeacherDto.edad};
    this.teachers.push(newTeacher);
    return newTeacher;
  }

  findAll() : Teacher [] {
    return this.teachers;
  }

  findOne(id: string) : Teacher {
    const teacher = this.teachers.find((teacher) => teacher.id === id);
    if(!teacher){
      throw new NotFoundException(`Profesor con id: ${id} no encontrado.`)
    }
    return teacher;
  }

  update(id: string, updateTeacherDto: UpdateTeacherDto) {
    const teacher = this.findOne(id);
    const updatedTeacher = {...teacher, ...updateTeacherDto}
    const index = this.teachers.findIndex((teacher) => teacher.id === id);
    this.teachers.splice(index, 1, updatedTeacher);
    return updatedTeacher;
  }

  delete(id: string) {
    const teacher = this.findOne(id);
    const index = this.teachers.findIndex((teacher) => teacher.id === id);
    this.teachers.splice(index, 1);
    return teacher;
  }

  fillTeachersWithSEED( TEACHERS_SEED: Teacher[]){
    this.teachers = TEACHERS_SEED;
  }
}
