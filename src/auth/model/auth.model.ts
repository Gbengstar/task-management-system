import { SchemaTypes } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
  toJSON: {
    transform: (_, ret) => {
      delete ret.password;
      return ret;
    },
  },
})
export class Auth {
  @Prop({ type: SchemaTypes.String, unique: true, index: true })
  username: string;

  @Prop({ type: SchemaTypes.String })
  password: string;
}

export const AuthSchema = SchemaFactory.createForClass(Auth);
