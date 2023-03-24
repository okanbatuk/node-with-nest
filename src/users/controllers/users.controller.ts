import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
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
import { UsersService } from 'src/users/services/users/users.service';
import { User } from '../interfaces/user.interface';
import { IUsersController } from '../interfaces/users.controller.interface';
import { JoiValidationPipe } from '../validations/joivalidation/joivalidation.pipe';
import { CreateUserDto, CreateUserSchema } from '../dtos/CreateUser.dto';

@Controller('users')
export class UsersController implements IUsersController {
  // Dependency Injection => import Users Service
  constructor(
    @Inject('USER_SERVICE') private readonly usersService: UsersService,
  ) {}

  // GET /users
  @Get()
  @HttpCode(HttpStatus.OK)
  async getUsers(
    @Query('sortDesc', ParseBoolPipe) sortDesc: boolean,
  ): Promise<User[]> {
    return this.usersService.findAll(sortDesc);
  }

  // POST /users
  @Post()
  @UsePipes(new JoiValidationPipe(CreateUserSchema))
  async createUser(
    @Body() userPayload: CreateUserDto,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      let newUser = await this.usersService.create(userPayload);
      return res.status(HttpStatus.CREATED).json({
        success: true,
        message: `${newUser.username} is created..`,
      });
    } catch (error) {
      throw new BadRequestException('User Not Created!!', {
        cause: new Error(),
        description: 'User not created!',
      });
    }
  }

  // GET /users/:userId
  @Get(':userId')
  async getUserById(
    @Param(
      'userId',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    userId: number,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      let user: User = await this.usersService.findUserById(userId);
      return user && res.status(HttpStatus.OK).send({ data: user });
    } catch (error) {
      throw new NotFoundException('User not found!', {
        cause: new Error(),
        description: 'User not found in DB',
      });
    }
  }

  // DELETE /users/:userId
  @Delete(':userId')
  async deleteUserById(
    @Param('userId', ParseIntPipe) userId: number,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      let deletedUser: User = await this.usersService.delete(userId);

      return res.status(HttpStatus.OK).send({
        success: true,
        message: `#${deletedUser.username} User deleted`,
      });
    } catch (error) {
      throw new NotFoundException('User not found!', {
        cause: new Error(),
        description: 'User not found in DB',
      });
    }
  }
}
