import { Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { v4 as uuidV4 } from 'uuid';

import { CreateTrackDto, UpdateTrackDto } from './dto';
import { FavsService } from 'src/favs/favs.service';

@Injectable()
export class TrackService {
  constructor(
    @Inject(forwardRef(() => FavsService))
    private readonly favsService: FavsService,
  ) {}

  private tracks: { [id: string]: Track } = {};

  private findTrack(id: string): Track {
    const track = this.tracks[id];
    if (!track) throw new NotFoundException('Track not found');

    return track;
  }

  create(createTrackDto: CreateTrackDto) {
    const id = uuidV4();
    const { albumId, artistId, duration, name } = createTrackDto;
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

  update(id: string, updateTrackDto: UpdateTrackDto) {
    this.findTrack(id);

    const { albumId, artistId, duration, name } = updateTrackDto;
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
