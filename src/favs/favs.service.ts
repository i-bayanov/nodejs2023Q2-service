import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FavsArtists } from './entities/favs.artists.entity';
import { FavsAlbums } from './entities/favs.albums.entity';
import { FavsTracks } from './entities/favs.tracks.entity';
import { Artist } from 'src/artist/entities/artist.entity';
import { Album } from 'src/album/entities/album.entity';
import { Track } from 'src/track/entities/track.entity';

@Injectable()
export class FavsService {
  constructor(
    @InjectRepository(FavsArtists)
    private favsArtistsRepository: Repository<FavsArtists>,

    @InjectRepository(FavsAlbums)
    private favsAlbumsRepository: Repository<FavsAlbums>,

    @InjectRepository(FavsTracks)
    private favsTracksRepository: Repository<FavsTracks>,

    @InjectRepository(Artist)
    private artistsRepository: Repository<Artist>,

    @InjectRepository(Album)
    private albumRepository: Repository<Album>,

    @InjectRepository(Track)
    private trackRepository: Repository<Track>,
  ) {}

  async addTrack(id: string) {
    const track = await this.trackRepository.findOneBy({ id });
    if (!track) throw new UnprocessableEntityException(`Track with id ${id} not found`);

    const createdFavsTrack = this.favsTracksRepository.create({ trackId: id });

    return await this.favsTracksRepository.save(createdFavsTrack);
  }

  async addAlbum(id: string) {
    const album = await this.albumRepository.findOneBy({ id });
    if (!album) throw new UnprocessableEntityException(`Album with id ${id} not found`);

    const createdFavsAlbum = this.favsAlbumsRepository.create({ albumId: id });

    return this.favsAlbumsRepository.save(createdFavsAlbum);
  }

  async addArtist(id: string) {
    const artist = await this.artistsRepository.findOneBy({ id });
    if (!artist) throw new UnprocessableEntityException(`Artist with id ${id} not found`);

    const createdFavsArtist = this.favsArtistsRepository.create({ artistId: id });

    return this.favsArtistsRepository.save(createdFavsArtist);
  }

  async findAll() {
    const artists = (await this.favsArtistsRepository.find()).map((album) => album.toResponse());
    const albums = (await this.favsAlbumsRepository.find()).map((album) => album.toResponse());
    const tracks = (await this.favsTracksRepository.find()).map((album) => album.toResponse());

    return { artists, albums, tracks };
  }

  async removeTrack(id: string) {
    await this.favsTracksRepository.delete({ trackId: id });
  }

  async removeAlbum(id: string) {
    await this.favsAlbumsRepository.delete({ albumId: id });
  }

  async removeArtist(id: string) {
    await this.favsArtistsRepository.delete({ artistId: id });
  }
}
