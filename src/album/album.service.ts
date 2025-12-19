import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Album } from './album.entity';
import { Artist } from '../artist/artist.entity';
import { CreateAlbumDto } from './dto/create-album.dto';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(Album)
    private readonly albumRepo: Repository<Album>,
    @InjectRepository(Artist)
    private readonly artistRepo: Repository<Artist>,
  ) {}

  async getAll() {
    return this.albumRepo.find({ order: { id: 'DESC' } });
  }

  async create(dto: CreateAlbumDto) {
    const title = dto.title?.trim();
    if (!title) throw new BadRequestException('title is required');

    const artist = await this.artistRepo.findOne({
      where: { id: dto.artistId },
    });
    if (!artist) throw new BadRequestException('Artist not found');

    const album = this.albumRepo.create({ title, artist });
    return this.albumRepo.save(album);
  }
}
