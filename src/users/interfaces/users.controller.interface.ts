import { Response } from 'express';
import { CreateUserDto } from '../dtos/CreateUser.dto';
import { SerializedUser } from './user.interface';

export interface IUsersController {
  getUsers: (sortBy: boolean, res: Response) => Promise<SerializedUser[]>;
  createUser: (userPayload: CreateUserDto, res: Response) => Promise<Response>;
  getUserById: (userId: number, res: Response) => Promise<SerializedUser[]>;
  deleteUserById: (userId: number, res: Response) => Promise<Response>;
}
