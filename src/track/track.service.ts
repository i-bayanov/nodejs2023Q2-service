import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateTrackDto, UpdateTrackDto } from './dto';

import { Track } from './entities/track.entity';
import { Artist } from 'src/artist/entities/artist.entity';
import { Album } from 'src/album/entities/album.entity';

@Injectable()
export class TrackService {
  constructor(
    @InjectRepository(Track)
    private trackRepository: Repository<Track>,

    @InjectRepository(Artist)
    private artistsRepository: Repository<Artist>,

    @InjectRepository(Album)
    private albumRepository: Repository<Album>,
  ) {}

  private async findTrack(id: string) {
    const track = await this.trackRepository.findOneBy({ id });
    if (!track) throw new NotFoundException('Track not found');

    return track;
  }

  private async checkAlbumAndArtistExistence(albumId: string | null, artistId: string | null) {
    if (albumId) {
      try {
        await this.albumRepository.findOneByOrFail({ id: albumId });
      } catch {
        throw new UnprocessableEntityException(`Album with id ${albumId} not found`);
      }
    }

    if (artistId) {
      try {
        await this.artistsRepository.findOneByOrFail({ id: artistId });
      } catch {
        throw new UnprocessableEntityException(`Artist with id ${artistId} not found`);
      }
    }
  }

  async create(createTrackDto: CreateTrackDto) {
    const { albumId, artistId } = createTrackDto;

    await this.checkAlbumAndArtistExistence(albumId, artistId);

    const createdTrack = this.trackRepository.create(createTrackDto);

    return this.trackRepository.save(createdTrack);
  }

  async findAll() {
    return (await this.trackRepository.find()).map((track) => track.toResponse());
  }

  async findOne(id: string) {
    return (await this.findTrack(id)).toResponse();
  }

  async update(id: string, updateTrackDto: UpdateTrackDto) {
    const track = await this.findTrack(id);

    const { albumId, artistId } = updateTrackDto;

    await this.checkAlbumAndArtistExistence(albumId, artistId);

    Object.assign(track, updateTrackDto);

    return this.trackRepository.save(track);
  }

  async remove(id: string) {
    const deleteResult = await this.trackRepository.delete(id);

    if (!deleteResult.affected) throw new NotFoundException('Track not found');
  }
}
