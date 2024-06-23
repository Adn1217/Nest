import { BadRequestException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { isValidObjectId } from 'mongoose';

export function isMongoId(req: Request, res: Response, next: NextFunction) {

  const id = req.params.id;
  if(isValidObjectId(id)){
    // console.log(`Id exitoso...`);
    next();
  }else{
    throw new BadRequestException(`Id debe ser un id mongo válido.`)
  }
};