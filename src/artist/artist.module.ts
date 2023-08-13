import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';
import { FavsModule } from 'src/favs/favs.module';

import { Artist } from './entities/artist.entity';

@Module({
  imports: [forwardRef(() => FavsModule), TypeOrmModule.forFeature([Artist])],
  controllers: [ArtistController],
  providers: [ArtistService],
  exports: [ArtistService, TypeOrmModule],
})
export class ArtistModule {}
