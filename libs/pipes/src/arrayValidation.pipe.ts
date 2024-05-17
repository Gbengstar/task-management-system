import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ArraySchema } from 'joi';

@Injectable()
export class ArrayValidationPipe implements PipeTransform {
  constructor(private readonly schema: ArraySchema) {}
  async transform(data: any): Promise<any> {
    try {
      const value = await this.schema.validateAsync(data, {
        stripUnknown: true,
        convert: false,
      });
      return value;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
