import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { TrackModule } from 'src/track/track.module';
import { FavsModule } from 'src/favs/favs.module';

import { Album } from './entities/album.entity';

@Module({
  imports: [
    forwardRef(() => TrackModule),
    forwardRef(() => FavsModule),
    TypeOrmModule.forFeature([Album]),
  ],
  controllers: [AlbumController],
  providers: [AlbumService],
  exports: [AlbumService, TypeOrmModule],
})
export class AlbumModule {}
