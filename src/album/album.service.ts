import { Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateAlbumDto, UpdateAlbumDto } from './dto';
import { TrackService } from 'src/track/track.service';
import { FavsService } from 'src/favs/favs.service';

import { Album } from './entities/album.entity';

@Injectable()
export class AlbumService {
  constructor(
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,

    @Inject(forwardRef(() => FavsService))
    private readonly favsService: FavsService,

    @InjectRepository(Album)
    private albumRepository: Repository<Album>,
  ) {}

  private async findAlbum(id: string): Promise<Album> {
    const album = await this.albumRepository.findOneBy({ id });
    if (!album) throw new NotFoundException('Album not found');

    return album;
  }

  create(createAlbumDto: CreateAlbumDto) {
    const createdAlbum = this.albumRepository.create(createAlbumDto);

    return this.albumRepository.save(createdAlbum);
  }

  async findAll() {
    return (await this.albumRepository.find()).map((album) => album.toResponse());
  }

  async findOne(id: string) {
    return (await this.findAlbum(id)).toResponse();
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto) {
    const album = await this.findAlbum(id);

    Object.assign(album, updateAlbumDto);

    return this.albumRepository.save(album);
  }

  async remove(id: string) {
    const deleteResult = await this.albumRepository.delete(id);

    if (!deleteResult.affected) throw new NotFoundException('Album not found');

    this.trackService.removeAlbumFromTracks(id);
    this.favsService.removeAlbum(id);
  }
}
