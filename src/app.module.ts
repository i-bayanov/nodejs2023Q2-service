import { APP_GUARD } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

import { UserModule } from './user/user.module';
import { ArtistModule } from './artist/artist.module';
import { TrackModule } from './track/track.module';
import { AlbumModule } from './album/album.module';
import { FavsModule } from './favs/favs.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from 'src/auth/auth.guard';

import { postgresHost, postgresPort, postgresUser, postgresPassword, postgresDB } from 'src/env';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: postgresHost,
      port: postgresPort,
      username: postgresUser,
      password: postgresPassword,
      database: postgresDB,
      autoLoadEntities: true,
      synchronize: false,
      retryAttempts: 100,
      entities: ['dist/src/**/entities/*.{ts,js}'],
      migrations: ['dist/migrations/*.{ts,js}'],
      migrationsRun: true,
    }),
    UserModule,
    ArtistModule,
    TrackModule,
    AlbumModule,
    FavsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtService, { provide: APP_GUARD, useClass: AuthGuard }],
})
export class AppModule {}
