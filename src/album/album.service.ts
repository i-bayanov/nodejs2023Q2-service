import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateAlbumDto, UpdateAlbumDto } from './dto';

import { Album } from './entities/album.entity';
import { Artist } from 'src/artist/entities/artist.entity';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(Album)
    private albumRepository: Repository<Album>,

    @InjectRepository(Artist)
    private artistsRepository: Repository<Artist>,
  ) {}

  private async findAlbum(id: string): Promise<Album> {
    const album = await this.albumRepository.findOneBy({ id });
    if (!album) throw new NotFoundException('Album not found');

    return album;
  }

  private async checkArtistExistence(artistId: string | null) {
    if (artistId) {
      try {
        await this.artistsRepository.findOneByOrFail({ id: artistId });
      } catch {
        throw new UnprocessableEntityException(`Artist with id ${artistId} not found`);
      }
    }
  }

  async create(createAlbumDto: CreateAlbumDto) {
    const { artistId } = createAlbumDto;

    await this.checkArtistExistence(artistId);

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

    const { artistId } = updateAlbumDto;

    await this.checkArtistExistence(artistId);

    Object.assign(album, updateAlbumDto);

    return this.albumRepository.save(album);
  }

  async remove(id: string) {
    const deleteResult = await this.albumRepository.delete(id);

    if (!deleteResult.affected) throw new NotFoundException('Album not found');
  }
}
