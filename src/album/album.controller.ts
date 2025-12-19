import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}


  @Get()
  getAll() {
    return this.albumService.getAll();
  }

  
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  create(@Body() dto: CreateAlbumDto) {
    return this.albumService.create(dto);
  }
}
