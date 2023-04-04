import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dtos/CreateUser.dto';
import { UpdateUserDto } from 'src/users/dtos/UpdateUserDto';
import { SerializedUser, User } from 'src/users/interfaces/user.interface';

@Injectable()
export class UsersService {
  // Instance of User storage
  private users: User[] = [];

  // Create user obj
  create(user: CreateUserDto): Promise<User> {
    return new Promise(async (resolve, reject) => {
      // Get user infos from param
      const { username, email, age, password } = user;

      // Check all users by email and username
      const conflictUser = this.users.find(
        (user) => user.username === username || user.email === email,
      );

      // Set new id
      const id: number =
        !conflictUser && this.users.length
          ? this.users[this.users.length - 1].id + 1
          : 1;

      // If conflict user exists return error
      conflictUser &&
        reject({
          message: 'Username or email has already been used!!',
          status: HttpStatus.CONFLICT,
        });

      if (!conflictUser) {
        // Create user according to user infos
        const newUser: User = {
          id,
          username,
          email,
          password,
          age: typeof age === 'string' ? parseInt(age) : age,
        };

        // Reset the stored users
        this.users = [...this.users, newUser];

        // If user created return this user
        newUser
          ? resolve(newUser)
          : reject({
              message: 'Something went wrong',
              status: HttpStatus.BAD_REQUEST,
            });
      }
    });
  }

  // Find all users
  findAll(sort: boolean): Promise<SerializedUser[]> {
    return new Promise((resolve, reject) => {
      // Sorted users by Sort value
      const sortedUser: User[] = this.users.length
        ? sort
          ? this.users.sort((a, b) => b.id - a.id)
          : this.users.sort((a, b) => a.id - b.id)
        : [];

      // Serialized the users according to SerializedUser class
      const serializedUser = sortedUser.map((user) => new SerializedUser(user));

      // If user exists return the user
      serializedUser.length ? resolve(serializedUser) : reject([]);
    });
  }

  // Find user by id
  findUserById(id: number): Promise<SerializedUser[]> {
    return new Promise((resolve, reject) => {
      let storedUser: User[] = this.users;

      // Get user by id
      let user: User[] =
        storedUser.length && storedUser.filter((user) => user.id === id);

      // Serialize the user by SerializedUser Class
      const serializedUser: SerializedUser[] =
        user.length && user.map((u) => new SerializedUser(u));

      // If user exists return the user
      serializedUser.length ? resolve(serializedUser) : reject(null);
    });
  }

  // Update user's information
  update(id: number, userInfo: UpdateUserDto): Promise<SerializedUser> {
    return new Promise((resolve, reject) => {
      // Get the user's info from userInfo value
      const { email, password, age } = userInfo;

      // Check the user by id
      const user: User =
        this.users && this.users.find((user) => user.id === id);

      !user &&
        reject({ message: 'User not found', status: HttpStatus.NOT_FOUND });

      let conflictUser: User =
        user &&
        this.users.find((user) => user.email === email && user.id !== id);

      conflictUser &&
        reject({
          message: 'Email has already been used',
          status: HttpStatus.CONFLICT,
        });

      if (user && !conflictUser) {
        const oldUsers: User[] = this.users.filter((user) => user.id !== id);

        const updatedUser: User = {
          id: user.id,
          username: user.username,
          email,
          password,
          age: typeof age === 'string' ? parseInt(age) : age,
        };

        this.users = [...oldUsers, updatedUser];

        const serializedUser = new SerializedUser(updatedUser);
        resolve(serializedUser);
      }
    });
  }

  // Delete user by id
  delete(id: number): Promise<User> {
    return new Promise((resolve, reject) => {
      // Get user by id
      let deletedUser: User = this.users.find((user) => user.id === id);

      // Delete the found user and reset stored user
      this.users = this.users.filter((user) => user.id !== id);

      // If user exists return the user
      deletedUser ? resolve(deletedUser) : reject({});
    });
  }
}
