import { ParseMongoIdPipe } from "src/common/pipes/parse-mongo-id.pipe";

export interface newCourse {
    curso: string;
    creditos: number;
}

export interface Course extends newCourse {
    id: ParseMongoIdPipe;
}