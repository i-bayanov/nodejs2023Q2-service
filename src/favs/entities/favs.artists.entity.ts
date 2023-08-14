import { Entity, PrimaryGeneratedColumn, JoinColumn, OneToOne } from 'typeorm';
import { Artist } from 'src/artist/entities/artist.entity';

@Entity()
export class FavsArtists {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Artist, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'artistId' })
  artistId: Artist | Artist['id'] | null;

  toResponse() {
    const { artistId } = this;

    return artistId;
  }
}
