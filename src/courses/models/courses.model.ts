export interface newCourse {
    curso: string;
    creditos: number;
}

export interface Course extends newCourse {
    id: string;
}