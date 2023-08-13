import {
  /* ConflictException,*/ Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateArtistDto, UpdateArtistDto } from './dto';
import { FavsService } from 'src/favs/favs.service';

import { Artist } from './entities/artist.entity';

@Injectable()
export class ArtistService {
  constructor(
    @Inject(forwardRef(() => FavsService))
    private readonly favsService: FavsService,

    @InjectRepository(Artist)
    private artistsRepository: Repository<Artist>,
  ) {}

  // private checkArtistExistence(createArtistDto: CreateArtistDto) {
  //   const isArtistAlreadyExists = Object.values(this.artists).some(
  //     (artist) => artist.name === createArtistDto.name,
  //   );
  //   if (isArtistAlreadyExists)
  //     throw new ConflictException(`Artist ${createArtistDto.name} already exists`);
  // }

  private async findArtist(id: string): Promise<Artist> {
    const artist = await this.artistsRepository.findOneBy({ id });
    if (!artist) throw new NotFoundException('Artist not found');

    return artist;
  }

  create(createArtistDto: CreateArtistDto) {
    // this.checkArtistExistence(createArtistDto);

    const createdArtist = this.artistsRepository.create(createArtistDto);

    return this.artistsRepository.save(createdArtist);
  }

  findAll() {
    return this.artistsRepository.find();
  }

  async findOne(id: string) {
    return await this.findArtist(id);
  }

  async update(id: string, updateArtistDto: UpdateArtistDto) {
    const artist = await this.findArtist(id);

    Object.assign(artist, updateArtistDto);

    return await this.artistsRepository.save(artist);
  }

  async remove(id: string) {
    const deleteResult = await this.artistsRepository.delete(id);

    if (!deleteResult.affected) throw new NotFoundException('Artist not found');

    this.favsService.removeArtist(id);
  }
}
