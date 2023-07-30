export class UpdateUserDto implements IUpdatePasswordDto {
  readonly oldPassword: string;
  readonly newPassword: string;
}
