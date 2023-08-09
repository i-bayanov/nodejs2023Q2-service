interface User {
  id: string; // uuid v4
  login: string;
  password: string;
  version: number; // integer number, increments on update
  createdAt: number; // timestamp of creation
  updatedAt: number; // timestamp of last update
}

type UserWoPassword = Omit<User, 'password'>;

interface ICreateUserDto {
  login: string;
  password: string;
}

interface IUpdatePasswordDto {
  oldPassword: string; // previous password
  newPassword: string; // new password
}
