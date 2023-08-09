import {
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
  forwardRef,
} from '@nestjs/common';
import { v4 as uuidV4 } from 'uuid';

import { CreateAlbumDto, UpdateAlbumDto } from './dto';
import { TrackService } from 'src/track/track.service';
import { FavsService } from 'src/favs/favs.service';
import { ArtistService } from 'src/artist/artist.service';

@Injectable()
export class AlbumService {
  constructor(
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,

    @Inject(forwardRef(() => FavsService))
    private readonly favsService: FavsService,

    @Inject(forwardRef(() => ArtistService))
    private readonly artistService: ArtistService,
  ) {}

  private albums: { [id: string]: Album } = {};

  private findAlbum(id: string): Album {
    const album = this.albums[id];
    if (!album) throw new NotFoundException('Album not found');

    return album;
  }

  private checkArtistExistence(artistId: string | null) {
    if (artistId) {
      try {
        this.artistService.findOne(artistId);
      } catch {
        throw new UnprocessableEntityException(`Artist with id ${artistId} not found`);
      }
    }
  }

  create(createAlbumDto: CreateAlbumDto) {
    const id = uuidV4();
    const { artistId, name, year } = createAlbumDto;

    this.checkArtistExistence(artistId);

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

    this.checkArtistExistence(artistId);

    const updatedAlbum: Album = { artistId, id, name, year };

    this.albums[id] = updatedAlbum;

    return updatedAlbum;
  }

  remove(id: string) {
    this.findAlbum(id);
    this.albums = Object.fromEntries(Object.entries(this.albums).filter(([key]) => key !== id));
    this.trackService.removeAlbumFromTracks(id);
    this.favsService.removeAlbum(id);
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
