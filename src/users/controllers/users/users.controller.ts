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
import { CreateUserDto } from '../../dtos/CreateUser.dto';
import { IUsersController } from '../../interfaces/IUsersController';
import { IUser } from '../../interfaces/IUser';

@Controller('users')
export class UsersController implements IUsersController {
  @Get()
  @HttpCode(HttpStatus.OK)
  getUsers(@Query('sortDesc', ParseBoolPipe) sortDesc: Boolean): IUser[] {
    console.log(sortDesc);
    return sortDesc
      ? [
          { username: 'John', email: 'john@example.com' },
          { username: 'Jane', email: 'jane@example.com' },
        ]
      : [
          { username: 'Jane', email: 'jane@example.com' },
          { username: 'John', email: 'john@example.com' },
        ];
  }

  @Post()
  @UsePipes(new ValidationPipe())
  createUser(
    @Body() userPayload: CreateUserDto,
    @Res() res: Response,
  ): Response {
    console.log(userPayload);
    return res.send('User Created');
  }

  @Get(':userId')
  @HttpCode(HttpStatus.OK)
  getUserById(
    @Param('userId', ParseIntPipe) userId: number,
    @Res() res: Response,
  ): Response {
    return res.send({ id: userId });
  }
}
