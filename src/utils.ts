import { ClassType, transformAndValidateSync } from 'class-transformer-validator';
import { Request } from 'express';
import { HttpException } from '~/exceptions/http.exception';

export class Utils {
  static dtoFromRequest<T extends object>(classType: ClassType<T>, req: Request): T {
    try {
      return transformAndValidateSync(classType, req.body as object);
    } catch (error) {
      throw new HttpException(400, JSON.stringify(error));
    }
  }

  static assert(condition: boolean, status: number, message: string): void {
    if (!condition) {
      throw new HttpException(status, message);
    }
  }
}
