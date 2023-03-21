import { Response } from 'express';
import { CreateUserDto } from 'src/users/dtos/CreateUser.dto';
import { IUser } from './IUser';

export interface IUsersController {
  getUsers: (sortBy: boolean) => IUser[];
  createUser: (userPayload: CreateUserDto, res: Response) => Response;
  getUserById: (userId: number, res: Response) => Response;
}
