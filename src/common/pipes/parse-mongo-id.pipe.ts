import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ParseMongoIdPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if(isValidObjectId(value)){
      return value;
    }else{
      throw new BadRequestException(`Id debe ser un ${metadata.data} mongo válido.`);
    }
  }
}
