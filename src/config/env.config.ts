
export const EnvConfig = () => ({
    environment: process.env.NODE_ENV || 'dev',
    db: process.env.DB,
    port: process.env.PORT || 3001,
    courseOrder: process.env.COURSE_ORDER || 1,
    enrollmentOrder: process.env.ENROLLMENT_ORDER || 1,
    studentOrder: process.env.STUDENT_ORDER || 1,
    teacherOrder: process.env.TEACHER_ORDER || 1,
});