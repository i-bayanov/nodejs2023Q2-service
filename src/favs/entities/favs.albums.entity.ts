import { Entity, PrimaryGeneratedColumn, JoinColumn, OneToOne } from 'typeorm';
import { Album } from 'src/album/entities/album.entity';

@Entity()
export class FavsAlbums {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Album, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'albumId' })
  albumId: Album | Album['id'] | null;

  toResponse() {
    const { albumId } = this;
    let album: Omit<Album, 'toResponse'>;

    if (typeof albumId === 'object' && albumId !== null) {
      const { id, name, year, artistId } = albumId;

      const artist_id = typeof artistId === 'object' ? artistId?.id || null : artistId;

      album = { id, name, year, artistId: artist_id };
    }

    return album;
  }
}
