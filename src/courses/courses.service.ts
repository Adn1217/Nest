import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateCourseDto } from './dto/createCourse.dto';
import { UpdateCourseDto } from './dto/updateCourse.dto';
import { Course, newCourse } from './models/courses.model';
import { Course as CourseEntity } from './entities/course.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginationDto } from './dto/pagination.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';


enum courseOrder {
  DESC = -1,
  ASC = 1
}

@Injectable()
export class CoursesService {
  
  private defaultOrder: string;

  constructor(
    @InjectModel(CourseEntity.name) 
    private readonly courseModel: Model<CourseEntity>,
    private readonly configService: ConfigService,
    ){
      this.defaultOrder = configService.get<string>('COURSE_ORDER');
  }

  private courses: Course[] = []

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    try {
      const newCourseMongo = await this.courseModel.create(createCourseDto);
      const {_id, creditos, curso } = newCourseMongo;
      const newCourseMg= {id: _id.toString(), curso, creditos}
      return newCourseMg;
    }catch(error){
      // console.log('Se presenta error: ', error);
      this.handleExceptions(error, 'guardar');
    }
  }
  
  async createMany(createCourseDto: CreateCourseDto | CreateCourseDto []): Promise<any> {
    try {
      //this.courseModel.insertMany ?
      const newCourseMongo = this.courseModel.create(createCourseDto);
      // const {_id, creditos, curso } = newCourseMongo;
      // const newCourseMg = {id: _id.toString(), curso, creditos}
      return newCourseMongo;
    }catch(error){
      // console.log('Se presenta error: ', error);
      this.handleExceptions(error, 'guardar');
    }
  }

  async findAll(paginationDto?: PaginationDto) : Promise<Course[]> {
    const {limit, offset} = paginationDto;
    try{
      const coursesMg = await this.courseModel.find().sort({
        curso: courseOrder[this.defaultOrder] // Ordena por atributo curso ascendente (1) o descendentemente (-1).
      }).limit(limit).skip(offset)
      //.select('-__v') // Elimina de la respuesta el atributo __v
      const courses = coursesMg.map((courseMg) => {
        const {_id, curso, creditos} = courseMg;
        const course = {id: _id, curso, creditos};
        return course
      })
    return courses
    }catch(error){
      this.handleExceptions(error, 'buscar');
    }
  }

  async findOne(id: ParseMongoIdPipe) : Promise<Course> {
    try{
      const course = await this.courseModel.findById(id);

      if(!course){
          throw new NotFoundException(`Curso con id: ${id} no encontrado.`);
      }else{
        const {_id, curso, creditos} = course;
        const courseMg = {id: _id, curso, creditos};
        return courseMg;
      }
    }catch(error){
      // console.log('Se presenta error: ', error );
      this.handleExceptions(error, 'buscar', id);
    }
  }
  
  //TODO: Optimizar con el método findByIdAndUpdate
  async update(id: ParseMongoIdPipe, updateCourseDto: UpdateCourseDto): Promise<Course> {
    try{
      const course = await this.findOne(id); 
      
      if(!course){
          throw new NotFoundException(`Curso con id: ${id} no encontrado.`);
      }else{
        const updatedCourseAck = await this.courseModel.updateOne({_id: id},updateCourseDto);
        //TODO: updatedCourse = await course.updateOne(updateCourseDto, { new: true}) // Devuelve el curso actualizado.
        // console.log('Ack: ', updatedCourseAck)
        if(updatedCourseAck.modifiedCount){
          const updatedCourse = {...course, ...updateCourseDto};
          console.log('Se ha actualizado el curso: ', updatedCourse);
          return updatedCourse;
        }else if (updatedCourseAck.matchedCount && !updatedCourseAck.modifiedCount){
          throw new Error('Curso en BD ya presenta los cambios solicidatos.')
        }else{
          throw new Error('Curso no actualizado.')
        }
      }
    }catch(error){
      // console.log('Se ha presentado error actualizando el curso: ', error);
      this.handleExceptions(error, 'editar', id);
    }
  }
  //TODO: Optimizar con el método findByIdAndDelete.
  async delete(id: ParseMongoIdPipe): Promise<Course> {
    try{
      const course = await this.findOne(id);
      // const course = await this.courseModel.findByIdAndDelete(id);
      
      if(!course){
          throw new NotFoundException(`Curso con id: ${id} no encontrado.`);
      }else{
        const deletedAck = await this.courseModel.deleteOne({_id: id});
        
        if(deletedAck.deletedCount){
          console.log('Se ha borrado el curso: ', JSON.stringify(course));
        }else{
          throw new Error(`Curso no borrado.`)
        }
        return course
      }
    }catch(error){
      this.handleExceptions(error, 'eliminar', id);
    }
  }

  async fillCoursesWithSEED( COURSES_SEED: newCourse[]): Promise<Course[]>{

    const coursesSeedMg: CreateCourseDto [] = COURSES_SEED.map((course: newCourse) : CreateCourseDto => {
      const {curso, creditos} = course;
      const courseMg = {curso, creditos};
      return courseMg;
    });

    // Haciendo uso de solicitudes individuales de creación.
    // const createdCourses = [];
    // coursesSeedMg.forEach( async (createCourse: CreateCourseDto) => {
    //   const createdCourse = this.createMany(createCourse);
    //   createdCourses.push( createdCourse );
    // })
    // const createdCoursesMg = Promise.all([...createdCourses]);

    // Haciendo uso de un arreglo.
    const createdCoursesMg = this.createMany(coursesSeedMg);
    return createdCoursesMg;
  }

  private handleExceptions(error: any, verb: string, id?: ParseMongoIdPipe){

    const errorMsg = error.keyValue;
    if(id){
      if(error.code === 11000){
        throw new BadRequestException(`Se ha presentado error al intentar ${verb} el curso con id: ${id} - ${JSON.stringify(errorMsg)} duplicado.}`);
      }else if (error.status === 404) {
        throw new NotFoundException(`Se ha presentado error al intentar ${verb} el curso con id: ${id} - ${JSON.stringify(error.message)}`)
      }else{
        throw new InternalServerErrorException(`Se ha presentado error al intentar ${verb} el curso con id ${id} - ${JSON.stringify(error.message)}}`);
      }
    }else{
      if (error.code === 11000){
        throw new BadRequestException(
          `Se ha presentado error al intentar ${verb} el curso - ${JSON.stringify(errorMsg)} duplicado.`
        )
      }else{
        throw new InternalServerErrorException(`Se ha presentado error al intentar ${verb} los cursos - ${JSON.stringify(error.message)}}`);
      }
    }
  }
}
