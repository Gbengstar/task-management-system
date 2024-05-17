import * as Joi from 'joi';
import { AuthDto } from '../dto/auth.dto';

const passwordValidator = Joi.string()
  .alphanum()
  .trim()
  .min(7)
  .max(32)
  .required();

export const signUpValidator = Joi.object<AuthDto>({
  username: Joi.string()
    .lowercase()
    .alphanum()
    .trim()
    .min(3)
    .max(32)
    .required(),
  password: passwordValidator,
});

export const changePasswordValidator = Joi.object({
  oldPassword: passwordValidator,
  newPassword: passwordValidator,
});
