import { Injectable } from '@nestjs/common';

@Injectable()
export class StudentsService {

  private students = [
    {
        id: 1,
        name: 'A'
    },
    {
        id:2,
        name: 'B'
    },
    {
        id:3,
        name: 'C'
    }
    ]


  findAll(){
    return this.students;
  }

  findById(id: number){
    let student = this.students.find((student) => student.id === id);
    if(!student){
        student = {
            id: id,
            name: 'No encontrado' 
        }
    }
    return student
  }
}
