import { users } from "src/students/models/students.interface"
import { Course } from "src/courses/models/courses.model"
import { Enrollment } from "src/enrollments/models/enrollments.interface"
import { Teacher } from "src/teachers/models/teachers.interface"

export interface seedDB {
    createdStudents: users[] | [],
    createdTeachers: Teacher[] | [],
    createdCourses: Course[] | [],
    createdEnrollments: Enrollment[] | []
}