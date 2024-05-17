import { Injectable } from '@nestjs/common';
import { BaseService } from '../../../libs/utils/src';
import { Auth } from '../model/auth.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AuthService extends BaseService<Auth> {
  constructor(@InjectModel(Auth.name) private readonly AuthModel: Model<Auth>) {
    super(AuthModel);
  }
}
