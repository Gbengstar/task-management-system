import * as Joi from 'joi';
import { AuthDto } from '../dto/auth.dto';

export const signUpValidator = Joi.object<AuthDto>({
  username: Joi.string()
    .lowercase()
    .alphanum()
    .trim()
    .min(7)
    .max(32)
    .required(),
  password: Joi.string().alphanum().trim().min(7).max(32).required(),
});
