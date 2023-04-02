import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class ExampleMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Running example middleware ..');
    const { authorization } = req.headers;

    authorization === 'abcd' && next();

    if (!authorization || authorization !== 'abcd') {
      throw new HttpException('Invalid Auth token', HttpStatus.FORBIDDEN);
    }
  }
}
