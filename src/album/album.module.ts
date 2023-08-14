import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';

import { Album } from './entities/album.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Album])],
  controllers: [AlbumController],
  providers: [AlbumService],
  exports: [TypeOrmModule],
})
export class AlbumModule {}
