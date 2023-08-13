import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';
import { Artist } from 'src/artist/entities/artist.entity';

@Entity()
export class Album {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  year: number;

  @ManyToOne(() => Artist, { eager: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'artistId' })
  artistId: Artist | Artist['id'] | null;

  toResponse() {
    const { id, name, year, artistId } = this;

    return {
      id,
      name,
      year,
      artistId: typeof artistId === 'object' ? artistId?.id || null : artistId,
    };
  }
}
