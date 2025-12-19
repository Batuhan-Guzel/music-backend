import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { SongService } from './song.service';
import { CreateSongDto } from './dto/create-song.dto';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('song')
export class SongController {
  constructor(private readonly songService: SongService) {}

  
  @Get()
  getAll() {
    return this.songService.getAll();
  }

  
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  create(@Body() dto: CreateSongDto) {
    return this.songService.create(dto);
  }
}
