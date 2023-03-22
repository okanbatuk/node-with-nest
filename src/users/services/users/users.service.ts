import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dtos/CreateUser.dto';
import { User } from 'src/users/interfaces/user.interface';

@Injectable()
export class UsersService {
  private users: User[] = [];

  create(user: CreateUserDto): void {
    const { username, email } = user;
    const id: number = this.users.length
      ? this.users[this.users.length - 1].id + 1
      : 1;
    const newUser: User = { id, username, email };
    this.users = [...this.users, newUser];
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
}
