import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidV4 } from 'uuid';

import { CreateUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UserService {
  private users: { [id: string]: User } = {};

  private checkUserExistance(createUserDto: CreateUserDto) {
    const isUserAlreadyExists = Object.values(this.users).some(
      (user) => user.login === createUserDto.login,
    );
    if (isUserAlreadyExists)
      throw new ConflictException(`User ${createUserDto.login} already exists`);
  }

  private findUser(id: string): User {
    const user = this.users[id];
    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  create(createUserDto: CreateUserDto): UserWoPassword {
    this.checkUserExistance(createUserDto);

    const id = uuidV4();
    const { login, password } = createUserDto;
    const now = Date.now();
    const createdAt = now;
    const updatedAt = now;
    const version = 1;
    const newUser: User = { id, login, password, createdAt, updatedAt, version };
    const userWoPassword: UserWoPassword = { id, login, createdAt, updatedAt, version };

    this.users[id] = newUser;

    return userWoPassword;
  }

  findAll(): UserWoPassword[] {
    return Object.values(this.users).map((user) => {
      const { password, ...userWoPassword } = user;

      return userWoPassword;
    });
  }

  findOne(id: string): UserWoPassword {
    const user = this.findUser(id);
    const { password, ...userWoPassword } = user;

    return userWoPassword;
  }

  update(id: string, updateUserDto: UpdateUserDto): UserWoPassword {
    const user = this.findUser(id);

    if (user.password !== updateUserDto.oldPassword)
      throw new ForbiddenException('Wrong old password');

    const updatedUser = {
      ...user,
      password: updateUserDto.newPassword,
      updatedAt: Date.now(),
      version: user.version + 1,
    };

    this.users[id] = updatedUser;

    const { password, ...userWoPassword } = updatedUser;

    return userWoPassword;
  }

  remove(id: string) {
    this.findUser(id);
    this.users = Object.fromEntries(Object.entries(this.users).filter(([key]) => key !== id));
  }
}
