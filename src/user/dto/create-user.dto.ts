export class CreateUserDto implements ICreateUserDto {
  readonly login: string;
  readonly password: string;
}
