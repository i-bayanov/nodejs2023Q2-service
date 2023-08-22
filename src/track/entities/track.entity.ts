import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';
import { Artist } from 'src/artist/entities/artist.entity';
import { Album } from 'src/album/entities/album.entity';

@Entity()
export class Track {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  duration: number;

  @ManyToOne(() => Artist, { eager: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'artistId' })
  artistId: Artist | Artist['id'] | null;

  @ManyToOne(() => Album, { eager: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'albumId' })
  albumId: Album | Album['id'] | null;

  toResponse() {
    const { id, name, duration, artistId, albumId } = this;
    const artist_id = typeof artistId === 'object' ? artistId?.id || null : artistId;
    const album_id = typeof albumId === 'object' ? albumId?.id || null : albumId;

    return { id, name, duration, artistId: artist_id, albumId: album_id };
  }
}
