import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TrackService } from './track.service';
import { TrackController } from './track.controller';
import { FavsModule } from 'src/favs/favs.module';

import { Track } from './entities/track.entity';

@Module({
  imports: [forwardRef(() => FavsModule), TypeOrmModule.forFeature([Track])],
  controllers: [TrackController],
  providers: [TrackService],
  exports: [TrackService, TypeOrmModule],
})
export class TrackModule {}
