import { Inject, Injectable, UnprocessableEntityException, forwardRef } from '@nestjs/common';
import { AlbumService } from 'src/album/album.service';
import { ArtistService } from 'src/artist/artist.service';
import { TrackService } from 'src/track/track.service';

@Injectable()
export class FavsService {
  constructor(
    @Inject(forwardRef(() => ArtistService))
    private readonly artistService: ArtistService,

    @Inject(forwardRef(() => AlbumService))
    private readonly albumService: AlbumService,

    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
  ) {}

  private favorites: Favorites = {
    artists: new Set<string>(),
    albums: new Set<string>(),
    tracks: new Set<string>(),
  };

  addTrack(id: string) {
    try {
      this.trackService.findOne(id);
    } catch {
      throw new UnprocessableEntityException(`Track with id ${id} not found`);
    }

    this.favorites.tracks.add(id);
  }

  addAlbum(id: string) {
    try {
      this.albumService.findOne(id);
    } catch {
      throw new UnprocessableEntityException(`Album with id ${id} not found`);
    }

    this.favorites.albums.add(id);
  }

  addArtist(id: string) {
    try {
      this.artistService.findOne(id);
    } catch {
      throw new UnprocessableEntityException(`Artist with id ${id} not found`);
    }

    this.favorites.artists.add(id);
  }

  findAll() {
    const artists = Array.from(this.favorites.artists).map((artistUuid) =>
      this.artistService.findOne(artistUuid),
    );
    const albums = Array.from(this.favorites.albums).map((albumUuid) =>
      this.albumService.findOne(albumUuid),
    );
    const tracks = Array.from(this.favorites.tracks).map((trackUuid) =>
      this.trackService.findOne(trackUuid),
    );

    return { artists, albums, tracks };
  }

  removeTrack(id: string) {
    this.favorites.tracks.delete(id);
  }

  removeAlbum(id: string) {
    this.favorites.albums.delete(id);
  }

  removeArtist(id: string) {
    this.favorites.artists.delete(id);
  }
}
