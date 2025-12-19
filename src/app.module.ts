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
      type: (process.env.DB_TYPE as any) || 'mssql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 1433),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,

      
      options:
        process.env.DB_TYPE === 'mssql'
          ? { encrypt: false, trustServerCertificate: true }
          : undefined,

     
      ssl:
        process.env.DB_TYPE === 'postgres' && process.env.DB_SSL === 'true'
          ? { rejectUnauthorized: false }
          : false,
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
