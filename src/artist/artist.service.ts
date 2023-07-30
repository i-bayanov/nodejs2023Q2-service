import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { v4 as uuidV4, validate as uuidValidate } from 'uuid';

import { CreateArtistDto, UpdateArtistDto } from './dto';

@Injectable()
export class ArtistService {
  private artists: { [id: string]: Artist } = {};

  private validateID(id: string) {
    if (!uuidValidate(id)) throw new HttpException('Artist id is invalid', HttpStatus.BAD_REQUEST);

    if (!(id in this.artists)) throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
  }

  private validateArtistBody(body: CreateArtistDto | UpdateArtistDto) {
    const isArtistNameValid =
      'name' in body && typeof body.name === 'string' && body.name.length > 0;
    const isArtistGrammyValid = 'grammy' in body && typeof body.grammy === 'boolean';

    if (!isArtistNameValid || !isArtistGrammyValid)
      throw new HttpException(
        'Request body does not contain required fields',
        HttpStatus.BAD_REQUEST,
      );
  }

  private checkArtistExistance(createArtistDto: CreateArtistDto) {
    const isArtistAlreadyExists = Object.values(this.artists).some(
      (artist) => artist.name === createArtistDto.name,
    );
    if (isArtistAlreadyExists)
      throw new HttpException(`Artist ${createArtistDto.name} already exists`, HttpStatus.CONFLICT);
  }

  create(createArtistDto: CreateArtistDto) {
    this.validateArtistBody(createArtistDto);
    this.checkArtistExistance(createArtistDto);

    const id = uuidV4();
    const { name, grammy } = createArtistDto;
    const newArtist: Artist = { id, name, grammy };

    this.artists[id] = newArtist;

    return newArtist;
  }

  findAll() {
    return Object.values(this.artists);
  }

  findOne(id: string) {
    this.validateID(id);

    return this.artists[id];
  }

  update(id: string, updateArtistDto: UpdateArtistDto) {
    this.validateID(id);
    this.validateArtistBody(updateArtistDto);

    const { name, grammy } = updateArtistDto;
    const updatedArtist = { id, name, grammy };

    this.artists[id] = updatedArtist;

    return updatedArtist;
  }

  remove(id: string) {
    this.validateID(id);
    this.artists = Object.fromEntries(Object.entries(this.artists).filter(([key]) => key !== id));
  }
}
