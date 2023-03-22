import { Response } from 'express';
import { CreateUserDto } from '../dtos/CreateUser.dto';
import { User } from './user.interface';

export interface IUsersController {
  getUsers: (sortBy: boolean) => Promise<User[]>;
  createUser: (userPayload: CreateUserDto, res: Response) => Response;
  getUserById: (userId: number, res: Response) => Promise<Response>;
}
