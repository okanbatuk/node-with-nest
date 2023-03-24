import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dtos/CreateUser.dto';
import { User } from 'src/users/interfaces/user.interface';

@Injectable()
export class UsersService {
  private users: User[] = [];

  create(user: CreateUserDto): Promise<User> {
    return new Promise(async (resolve, reject) => {
      const { username, email, age, password } = user;
      const id: number = this.users.length
        ? this.users[this.users.length - 1].id + 1
        : 1;

      const newUser: User = {
        id,
        username,
        email,
        password,
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

  findUserById(id: number): Promise<User> {
    return new Promise((resolve, reject) => {
      let user: User = this.users.find((user) => user.id === id);

      user ? resolve(user) : reject(null);
    });
  }

  delete(id: number): Promise<User> {
    return new Promise((resolve, reject) => {
      let deletedUser: User = this.users.find((user) => user.id === id);
      this.users = this.users.filter((user) => user.id !== id);
      deletedUser ? resolve(deletedUser) : reject([]);
    });
  }
}
