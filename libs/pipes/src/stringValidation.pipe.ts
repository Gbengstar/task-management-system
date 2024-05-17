import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { StringSchema } from 'joi';

@Injectable()
export class StringValidationPipe implements PipeTransform {
  constructor(private readonly schema: StringSchema) {}
  async transform(data: string): Promise<string> {
    try {
      const value = await this.schema.validateAsync(data);
      return value;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
