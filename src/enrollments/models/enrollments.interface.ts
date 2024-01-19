
export interface newEnrollment {
  courseId: string,
  userId: string
  }
export interface Enrollment extends newEnrollment {
    id: string;
  }