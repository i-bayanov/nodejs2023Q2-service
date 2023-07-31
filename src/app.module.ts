import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { UserModule } from './user/user.module';
import { ArtistModule } from './artist/artist.module';
import { TrackModule } from './track/track.module';
import { AlbumModule } from './album/album.module';
import { FavsModule } from './favs/favs.module';

@Module({
  imports: [ConfigModule.forRoot(), UserModule, ArtistModule, TrackModule, AlbumModule, FavsModule],
})
export class AppModule {}
