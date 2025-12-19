import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Playlist } from './playlist.entity';
import { PlaylistService } from './playlist.service';
import { PlaylistController } from './playlist.controller';
import { User } from '../user/user.entity';
import { Song } from '../song/song.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Playlist, User, Song])],
  providers: [PlaylistService],
  controllers: [PlaylistController],
})
export class PlaylistModule {}
