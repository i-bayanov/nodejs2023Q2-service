import { Transform, TransformFnParams } from 'class-transformer';
import { IsNotEmpty, IsString, IsUUID, ValidateIf, IsInt, IsPositive } from 'class-validator';

export class UpdateAlbumDto implements TUpdateAlbumDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => typeof value === 'string' && value.trim())
  name: string;

  @IsInt()
  @IsPositive()
  year: number;

  @ValidateIf((_object, value) => value !== null)
  @IsUUID(undefined, { message: 'albumId must be a UUID or null' })
  artistId: string | null;
}
