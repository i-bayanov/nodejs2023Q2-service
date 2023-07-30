import { /* ConflictException,*/ Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidV4 } from 'uuid';

import { CreateArtistDto, UpdateArtistDto } from './dto';

@Injectable()
export class ArtistService {
  private artists: { [id: string]: Artist } = {};

  // private checkArtistExistance(createArtistDto: CreateArtistDto) {
  //   const isArtistAlreadyExists = Object.values(this.artists).some(
  //     (artist) => artist.name === createArtistDto.name,
  //   );
  //   if (isArtistAlreadyExists)
  //     throw new ConflictException(`Artist ${createArtistDto.name} already exists`);
  // }

  private findArtist(id: string): Artist {
    const artist = this.artists[id];
    if (!artist) throw new NotFoundException('Artist not found');

    return artist;
  }

  create(createArtistDto: CreateArtistDto) {
    // this.checkArtistExistance(createArtistDto);

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
    return this.findArtist(id);
  }

  update(id: string, updateArtistDto: UpdateArtistDto) {
    this.findArtist(id);

    const { name, grammy } = updateArtistDto;
    const updatedArtist = { id, name, grammy };

    this.artists[id] = updatedArtist;

    return updatedArtist;
  }

  remove(id: string) {
    this.findArtist(id);
    this.artists = Object.fromEntries(Object.entries(this.artists).filter(([key]) => key !== id));
  }
}
