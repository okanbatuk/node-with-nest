import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dtos/CreateUser.dto';
import { User } from 'src/users/interfaces/user.interface';

@Injectable()
export class UsersService {
  private users: User[] = [];

  create(user: CreateUserDto): Promise<User> {
    return new Promise((resolve, reject) => {
      const { username, email, age } = user;
      const id: number = this.users.length
        ? this.users[this.users.length - 1].id + 1
        : 1;
      const newUser: User = {
        id,
        username,
        email,
        age: typeof age === 'string' ? parseInt(age) : age,
      };
      this.users = [...this.users, newUser];

      newUser ? resolve(newUser) : reject(null);
    });
  }

  findAll(sort: boolean): User[] {
    return sort
      ? this.users.sort((a, b) => b.id - a.id)
      : this.users.sort((a, b) => a.id - b.id);
  }

  findUserById(id: number): Promise<User[]> | Promise<[]> {
    return new Promise((resolve, reject) => {
      let user: User[] = this.users.filter((user) => user.id === id);

      user.length ? resolve(user) : reject([]);
    });
  }

  delete(id: number): Promise<User[]> | Promise<[]> {
    return new Promise((resolve, reject) => {
      let deletedUser = this.users.filter((user) => user.id === id);
      this.users = this.users.filter((user) => user.id !== id);
      deletedUser.length ? resolve(deletedUser) : reject([]);
    });
  }
}
