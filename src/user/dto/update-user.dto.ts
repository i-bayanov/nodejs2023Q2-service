import { Transform, TransformFnParams } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserDto implements IUpdatePasswordDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => typeof value === 'string' && value.trim())
  readonly oldPassword: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => typeof value === 'string' && value.trim())
  readonly newPassword: string;
}
