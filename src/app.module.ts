import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './user/user.entity';
import { Role } from './role/role.entity';
import { Playlist } from './playlist/playlist.entity';
import { Artist } from './artist/artist.entity';
import { Album } from './album/album.entity';
import { Song } from './song/song.entity';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { PlaylistModule } from './playlist/playlist.module';
import { ArtistModule } from './artist/artist.module';
import { AlbumModule } from './album/album.module';
import { SongModule } from './song/song.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [User, Role, Playlist, Artist, Album, Song],
      synchronize: true,

      
      ssl: { rejectUnauthorized: false },
    }),

    AuthModule,
    UserModule,
    RoleModule,
    PlaylistModule,
    ArtistModule,
    AlbumModule,
    SongModule,
  ],
})
export class AppModule {}
