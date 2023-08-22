import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TrackService } from './track.service';
import { TrackController } from './track.controller';

import { Track } from './entities/track.entity';

import { ArtistModule } from 'src/artist/artist.module';
import { AlbumModule } from 'src/album/album.module';

@Module({
  imports: [TypeOrmModule.forFeature([Track]), ArtistModule, AlbumModule],
  controllers: [TrackController],
  providers: [TrackService],
  exports: [TypeOrmModule],
})
export class TrackModule {}
