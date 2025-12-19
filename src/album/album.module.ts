import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Album } from './album.entity';
import { Artist } from '../artist/artist.entity';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Album, Artist])],
  providers: [AlbumService],
  controllers: [AlbumController],
})
export class AlbumModule {}
