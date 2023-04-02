import { Exclude } from 'class-transformer';

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  age: number;
}

export class SerializedUser implements User {
  @Exclude()
  id: number;
  @Exclude()
  password: string;

  username: string;
  email: string;
  age: number;

  constructor(partial: Partial<SerializedUser>) {
    Object.assign(this, partial);
  }
}
