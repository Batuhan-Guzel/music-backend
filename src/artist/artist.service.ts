import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Artist } from './artist.entity';
import { CreateArtistDto } from './dto/create-artist.dto';

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(Artist)
    private readonly artistRepo: Repository<Artist>,
  ) {}

  async getAll() {
    return this.artistRepo.find({ order: { id: 'DESC' } });
  }

  async create(dto: CreateArtistDto) {
    const name = dto.name?.trim();
    if (!name) throw new BadRequestException('name is required');

    const exists = await this.artistRepo.findOne({ where: { name } });
    if (exists) throw new BadRequestException('Artist already exists');

    const artist = this.artistRepo.create({ name });
    return this.artistRepo.save(artist);
  }
}
