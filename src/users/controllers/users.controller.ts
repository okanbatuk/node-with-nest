import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  ConflictException,
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
  Res,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from 'src/users/services/users/users.service';
import { SerializedUser, User } from '../interfaces/user.interface';
import { IUsersController } from '../interfaces/users.controller.interface';
import { JoiValidationPipe } from '../validations/joivalidation/joivalidation.pipe';
import { CreateUserDto, CreateUserSchema } from '../dtos/CreateUser.dto';
import { UpdateUserDto, UpdateUserSchema } from '../dtos/UpdateUserDto';

@Controller('users')
export class UsersController implements IUsersController {
  // Dependency Injection => import Users Service
  constructor(
    @Inject('USER_SERVICE') private readonly usersService: UsersService,
  ) {}

  // GET /users
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  @HttpCode(HttpStatus.OK)
  async getUsers(
    @Query('sortDesc', ParseBoolPipe) sortDesc: boolean,
  ): Promise<SerializedUser[]> {
    try {
      // Get all users by sortDesc value
      let sortedUser: SerializedUser[] = await this.usersService.findAll(
        sortDesc,
      );
      return sortedUser;
    } catch (error) {
      throw new NotFoundException('There is no user', {
        cause: new Error(),
        description: 'User Not Found in db',
      });
    }
  }

  // POST /users
  @Post()
  // Use validation pipe for create user
  @UsePipes(new JoiValidationPipe(CreateUserSchema))
  async createUser(
    @Body() userPayload: CreateUserDto,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      // Create new user by user payload
      let newUser: User = await this.usersService.create(userPayload);

      return res.status(HttpStatus.CREATED).json({
        success: true,
        message: `${newUser.username} is created..`,
      });
    } catch (error) {
      const { status, message } = error;

      if (status === HttpStatus.CONFLICT) {
        throw new ConflictException('User Not Created !!', {
          cause: new Error(),
          description: message,
        });
      } else {
        throw new BadRequestException('User Not Created!!', {
          cause: new Error(),
          description: 'User not created!',
        });
      }
    }
  }

  // GET /users/:userId
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':userId')
  async getUserById(
    @Param(
      'userId',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    userId: number,
  ): Promise<SerializedUser[]> {
    try {
      // Get the serialized user by userId
      let user: SerializedUser[] = await this.usersService.findUserById(userId);

      return user;
    } catch (error) {
      throw new NotFoundException('User not found!', {
        cause: new Error(),
        description: 'User not found in DB',
      });
    }
  }

  // POST /users/:userId
  @Post(':userId')
  async updateUser(
    @Param(
      'userId',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    userId: number,
    @Body(new JoiValidationPipe(UpdateUserSchema))
    userPayload: UpdateUserDto,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      // Update the user by user payload if user exists
      let updatedUser: User = await this.usersService.update(
        userId,
        userPayload,
      );

      return res.status(HttpStatus.OK).json({
        success: true,
        message: `#${updatedUser.username} is updated..`,
      });
    } catch (error) {
      const { message, status } = error;
      if (status === HttpStatus.CONFLICT) {
        throw new ConflictException('User Not Updated', {
          cause: new Error(),
          description: message,
        });
      } else if (status === HttpStatus.NOT_FOUND) {
        throw new NotFoundException('User Not Updated', {
          cause: new Error(),
          description: message,
        });
      } else {
        throw new BadRequestException('User Not Updated', {
          cause: new Error(),
          description: 'Something went wrong',
        });
      }
    }
  }

  // DELETE /users/:userId
  @Delete(':userId')
  async deleteUserById(
    @Param('userId', ParseIntPipe) userId: number,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      // Delete the user by id
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
