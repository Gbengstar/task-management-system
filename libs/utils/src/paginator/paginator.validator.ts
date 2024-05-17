import * as Joi from 'joi';

export const paginatorValidator = Joi.object({
  limit: Joi.number().default(50),
  page: Joi.number().default(1),
});
