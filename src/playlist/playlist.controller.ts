import { Body, Controller, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PlaylistService } from './playlist.service';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { AddSongDto } from './dto/add-song.dto';

@Controller('playlist')
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req: any, @Body() dto: CreatePlaylistDto) {
    return this.playlistService.createPlaylist(req.user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  my(@Req() req: any) {
    return this.playlistService.myPlaylists(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/songs')
  addSong(
    @Req() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AddSongDto,
  ) {
    return this.playlistService.addSongToPlaylist(req.user.userId, id, dto);
  }
}
