import { Transform, TransformFnParams } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto implements ICreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => typeof value === 'string' && value.trim())
  readonly login: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => typeof value === 'string' && value.trim())
  readonly password: string;
}
