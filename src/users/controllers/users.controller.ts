import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Post,
  Query,
  Req,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CreateUserDto } from '../dtos/CreateUser.dto';
import { IUsersController } from '../interfaces/users.controller.interface';
import { User } from '../interfaces/user.interface';
import { UsersService } from 'src/users/services/users/users.service';

@Controller('users')
export class UsersController implements IUsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getUsers(
    @Query('sortDesc', ParseBoolPipe) sortDesc: boolean,
  ): Promise<User[]> {
    return this.usersService.findAll(sortDesc);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  createUser(
    @Body() userPayload: CreateUserDto,
    @Res() res: Response,
  ): Response {
    this.usersService.create(userPayload);
    return res.send('User Created');
  }

  @Get(':userId')
  @HttpCode(HttpStatus.OK)
  async getUserById(
    @Param('userId', ParseIntPipe) userId: number,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      let user = await this.usersService.findUserById(userId);
      return user.length && res.send({ data: user });
    } catch (error) {
      throw new NotFoundException('User not found!', {
        cause: new Error(),
        description: 'User not found in DB',
      });
    }
  }

  @Delete(':userId')
  @HttpCode(HttpStatus.OK)
  async deleteUserById(
    @Param('userId', ParseIntPipe) userId: number,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      let deletedUser: User[] = await this.usersService.delete(userId);

      return res.send({
        success: true,
        message: `#${deletedUser[0].username} User deleted`,
      });
    } catch (error) {
      throw new NotFoundException('User not found!');
    }
  }
}
