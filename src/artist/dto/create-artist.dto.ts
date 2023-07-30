import { Transform, TransformFnParams } from 'class-transformer';
import { IsNotEmpty, IsString, IsBoolean } from 'class-validator';

export class CreateArtistDto implements TCreateArtistDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => typeof value === 'string' && value.trim())
  readonly name: string;

  @IsBoolean()
  @IsNotEmpty()
  readonly grammy: boolean;
}
