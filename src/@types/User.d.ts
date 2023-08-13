interface IUser {
  id: string; // uuid v4
  login: string;
  password: string;
  version: number; // integer number, increments on update
  createdAt: string; // timestamp of creation
  updatedAt: string; // timestamp of last update
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
