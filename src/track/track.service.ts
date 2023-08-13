import {
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
  forwardRef,
} from '@nestjs/common';
import { v4 as uuidV4 } from 'uuid';

import { CreateTrackDto, UpdateTrackDto } from './dto';
import { FavsService } from 'src/favs/favs.service';
import { ArtistService } from 'src/artist/artist.service';
import { AlbumService } from 'src/album/album.service';

@Injectable()
export class TrackService {
  constructor(
    @Inject(forwardRef(() => FavsService))
    private readonly favsService: FavsService,

    @Inject(forwardRef(() => ArtistService))
    private readonly artistService: ArtistService,

    @Inject(forwardRef(() => AlbumService))
    private readonly albumService: AlbumService,
  ) {}

  private tracks: { [id: string]: Track } = {};

  private findTrack(id: string): Track {
    const track = this.tracks[id];
    if (!track) throw new NotFoundException('Track not found');

    return track;
  }

  private async checkAlbumAndArtistExistence(albumId: string | null, artistId: string | null) {
    if (albumId) {
      try {
        this.albumService.findOne(albumId);
      } catch {
        throw new UnprocessableEntityException(`Album with id ${albumId} not found`);
      }
    }

    if (artistId) {
      try {
        await this.artistService.findOne(artistId);
      } catch {
        throw new UnprocessableEntityException(`Artist with id ${artistId} not found`);
      }
    }
  }

  async create(createTrackDto: CreateTrackDto) {
    const id = uuidV4();
    const { albumId, artistId, duration, name } = createTrackDto;

    await this.checkAlbumAndArtistExistence(albumId, artistId);

    const newTrack: Track = { albumId, artistId, duration, id, name };

    this.tracks[id] = newTrack;

    return newTrack;
  }

  findAll() {
    return Object.values(this.tracks);
  }

  findOne(id: string) {
    return this.findTrack(id);
  }

  async update(id: string, updateTrackDto: UpdateTrackDto) {
    this.findTrack(id);

    const { albumId, artistId, duration, name } = updateTrackDto;

    await this.checkAlbumAndArtistExistence(albumId, artistId);

    const updatedTrack = { id, albumId, artistId, duration, name };

    this.tracks[id] = updatedTrack;

    return updatedTrack;
  }

  remove(id: string) {
    this.findTrack(id);
    this.tracks = Object.fromEntries(Object.entries(this.tracks).filter(([key]) => key !== id));
    this.favsService.removeTrack(id);
  }

  removeArtistFromTracks(artistId: string) {
    this.tracks = Object.fromEntries(
      Object.entries(this.tracks).map(([trackId, track]) => {
        if (track.artistId === artistId) return [trackId, { ...track, artistId: null }];

        return [trackId, track];
      }),
    );
  }

  removeAlbumFromTracks(albumId: string) {
    this.tracks = Object.fromEntries(
      Object.entries(this.tracks).map(([trackId, track]) => {
        if (track.albumId === albumId) return [trackId, { ...track, albumId: null }];

        return [trackId, track];
      }),
    );
  }
}
