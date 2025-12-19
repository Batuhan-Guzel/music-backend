import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Song } from './song.entity';
import { Album } from '../album/album.entity';
import { CreateSongDto } from './dto/create-song.dto';

@Injectable()
export class SongService {
  constructor(
    @InjectRepository(Song)
    private readonly songRepo: Repository<Song>,
    @InjectRepository(Album)
    private readonly albumRepo: Repository<Album>,
  ) {}

  async getAll() {
    return this.songRepo.find({ order: { id: 'DESC' } });
  }

  async create(dto: CreateSongDto) {
    const title = dto.title?.trim();
    if (!title) throw new BadRequestException('title is required');

    const album = await this.albumRepo.findOne({
      where: { id: dto.albumId },
    });
    if (!album) throw new BadRequestException('Album not found');

    const song = this.songRepo.create({ title, album });
    return this.songRepo.save(song);
  }
}
