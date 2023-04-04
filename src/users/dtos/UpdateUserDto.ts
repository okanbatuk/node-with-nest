import * as Joi from 'joi';

export const UpdateUserSchema = Joi.object({
  email: Joi.string().email().max(50).required(),
  password: Joi.string().min(6).max(100).required(),
  age: Joi.number().min(12).max(70).required(),
}).options({ abortEarly: false });

export interface UpdateUserDto {
  email: string;
  password: string;
  age: number;
}
