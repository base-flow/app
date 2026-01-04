import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  private readonly users = [
    {
      id: '1',
      username: 'admin',
      age: 20,
      password: '123456',
    },
    {
      id: '2',
      username: 'maria',
      age: 21,
      password: 'guess',
    },
  ];

  async findOne(username: string): Promise<User.IUser | undefined> {
    return this.users.find(user => user.username === username);
  }
}
