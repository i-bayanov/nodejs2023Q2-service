import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';

import { Album } from './entities/album.entity';

import { ArtistModule } from 'src/artist/artist.module';

@Module({
  imports: [TypeOrmModule.forFeature([Album]), ArtistModule],
  controllers: [AlbumController],
  providers: [AlbumService],
  exports: [TypeOrmModule],
})
export class AlbumModule {}
