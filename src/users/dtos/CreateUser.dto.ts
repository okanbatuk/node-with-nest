import * as Joi from 'joi';

export const CreateUserSchema = Joi.object({
  username: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().max(50).required(),
  password: Joi.string().min(6).max(100).required(),
  age: Joi.number().min(12).max(70).required(),
}).options({ abortEarly: false });

export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  age: number;
}
