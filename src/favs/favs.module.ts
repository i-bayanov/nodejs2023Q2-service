import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FavsService } from './favs.service';
import { FavsController } from './favs.controller';

import { FavsArtists } from './entities/favs.artists.entity';
import { FavsAlbums } from './entities/favs.albums.entity';
import { FavsTracks } from './entities/favs.tracks.entity';

import { ArtistModule } from 'src/artist/artist.module';
import { AlbumModule } from 'src/album/album.module';
import { TrackModule } from 'src/track/track.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FavsArtists, FavsAlbums, FavsTracks]),
    ArtistModule,
    AlbumModule,
    TrackModule,
  ],
  controllers: [FavsController],
  providers: [FavsService],
})
export class FavsModule {}
