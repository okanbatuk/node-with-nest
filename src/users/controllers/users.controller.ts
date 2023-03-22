import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
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
    console.log(sortDesc);
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
      return res.send({ data: user });
    } catch (error) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .send({ message: 'User not found' });
    }
  }
}
