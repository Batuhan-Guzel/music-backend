import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  
  @Get()
  getAll() {
    return this.artistService.getAll();
  }

  
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  create(@Body() dto: CreateArtistDto) {
    return this.artistService.create(dto);
  }
}
