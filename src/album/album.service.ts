import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidV4 } from 'uuid';

import { CreateAlbumDto, UpdateAlbumDto } from './dto';
import { TrackService } from 'src/track/track.service';

@Injectable()
export class AlbumService {
  constructor(private readonly trackService: TrackService) {}

  private albums: { [id: string]: Album } = {};

  private findAlbum(id: string): Album {
    const album = this.albums[id];
    if (!album) throw new NotFoundException('Album not found');

    return album;
  }

  create(createAlbumDto: CreateAlbumDto) {
    const id = uuidV4();
    const { artistId, name, year } = createAlbumDto;
    const newAlbum: Album = { artistId, id, name, year };

    this.albums[id] = newAlbum;

    return newAlbum;
  }

  findAll() {
    return Object.values(this.albums);
  }

  findOne(id: string) {
    return this.findAlbum(id);
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto) {
    this.findAlbum(id);

    const { artistId, name, year } = updateAlbumDto;
    const updatedAlbum: Album = { artistId, id, name, year };

    this.albums[id] = updatedAlbum;

    return updatedAlbum;
  }

  remove(id: string) {
    this.findAlbum(id);
    this.albums = Object.fromEntries(Object.entries(this.albums).filter(([key]) => key !== id));
    this.trackService.removeAlbumFromTracks(id);
  }

  removeArtistFromAlbums(artistId: string) {
    this.albums = Object.fromEntries(
      Object.entries(this.albums).map(([albumId, album]) => {
        if (album.artistId === artistId) return [albumId, { ...album, artistId: null }];

        return [albumId, album];
      }),
    );
  }
}
