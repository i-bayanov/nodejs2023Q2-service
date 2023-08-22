import { Entity, PrimaryGeneratedColumn, JoinColumn, OneToOne } from 'typeorm';
import { Track } from 'src/track/entities/track.entity';

@Entity()
export class FavsTracks {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Track, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'trackId' })
  trackId: Track | Track['id'] | null;

  toResponse() {
    const { trackId } = this;
    let track: Omit<Track, 'toResponse'>;

    if (typeof trackId === 'object' && trackId !== null) {
      const { id, name, duration, albumId, artistId } = trackId;

      const artist_id = typeof artistId === 'object' ? artistId?.id || null : artistId;
      const album_id = typeof albumId === 'object' ? albumId?.id || null : albumId;

      track = { id, name, duration, artistId: artist_id, albumId: album_id };
    }

    return track;
  }
}
