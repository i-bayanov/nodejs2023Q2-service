import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { v4 as uuidV4, validate as uuidValidate } from 'uuid';

import { CreateUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UserService {
  private users: { [id: string]: User } = {};

  private validateID(id: string) {
    if (!uuidValidate(id)) throw new HttpException('User id is invalid', HttpStatus.BAD_REQUEST);

    if (!(id in this.users)) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }

  private validateOldPassword(updateUserDto: UpdateUserDto, user: User) {
    if (!('oldPassword' in updateUserDto))
      throw new HttpException(
        'Request body does not contain required fields',
        HttpStatus.BAD_REQUEST,
      );
    if (updateUserDto.oldPassword !== user.password)
      throw new HttpException('Old password is wrong', HttpStatus.FORBIDDEN);
  }

  private validateCreateUserBody(body: ICreateUserDto) {
    const isUserLoginValid =
      'login' in body && typeof body.login === 'string' && body.login.length > 0;
    const isUserPasswordValid =
      'password' in body && typeof body.password === 'string' && body.password.length > 0;

    if (!isUserLoginValid || !isUserPasswordValid)
      throw new HttpException(
        'Request body does not contain required fields',
        HttpStatus.BAD_REQUEST,
      );
  }

  private checkUserExistance(createUserDto: CreateUserDto) {
    const isUserAlreadyExists = Object.values(this.users).some(
      (user) => user.login === createUserDto.login,
    );
    if (isUserAlreadyExists)
      throw new HttpException(`User ${createUserDto.login} already exists`, HttpStatus.CONFLICT);
  }

  private validateUpdatePasswordBody(body: IUpdatePasswordDto) {
    const isNewPasswordValid =
      'newPassword' in body && typeof body.newPassword === 'string' && body.newPassword.length > 0;

    if (!isNewPasswordValid)
      throw new HttpException(
        'Request body does not contain required fields',
        HttpStatus.BAD_REQUEST,
      );
  }

  create(createUserDto: CreateUserDto): UserWoPassword {
    this.validateCreateUserBody(createUserDto);
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
    this.validateID(id);
    const user = this.users[id];
    const { password, ...userWoPassword } = user;

    return userWoPassword;
  }

  update(id: string, updateUserDto: UpdateUserDto): UserWoPassword {
    this.validateID(id);
    const user = this.users[id];
    this.validateOldPassword(updateUserDto, user);
    this.validateUpdatePasswordBody(updateUserDto);

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
    this.validateID(id);
    this.users = Object.fromEntries(Object.entries(this.users).filter(([key]) => key !== id));
  }
}