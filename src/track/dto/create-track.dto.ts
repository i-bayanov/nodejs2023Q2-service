import { Transform, TransformFnParams } from 'class-transformer';
import { IsNotEmpty, IsString, IsUUID, ValidateIf, IsInt, IsPositive } from 'class-validator';

export class CreateTrackDto implements TCreateTrackDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => typeof value === 'string' && value.trim())
  name: string;

  @ValidateIf((_object, value) => value !== null)
  @IsUUID(undefined, { message: 'artistId must be a UUID or null' })
  artistId: string | null;

  @ValidateIf((_object, value) => value !== null)
  @IsUUID(undefined, { message: 'albumId must be a UUID or null' })
  albumId: string | null;

  @IsInt()
  @IsPositive()
  duration: number;
}
