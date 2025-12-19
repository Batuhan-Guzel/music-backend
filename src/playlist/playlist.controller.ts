import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Param,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PlaylistService } from './playlist.service';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { AddSongDto } from './dto/add-song.dto';

@UseGuards(JwtAuthGuard)
@Controller('playlist')
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  @Post()
  create(@Req() req: any, @Body() dto: CreatePlaylistDto) {
    return this.playlistService.createPlaylist(req.user.sub, dto);
  }

  @Get('my')
  myPlaylists(@Req() req: any) {
    return this.playlistService.myPlaylists(req.user.sub);
  }

  @Post(':id/songs')
  addSong(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: AddSongDto,
  ) {
    return this.playlistService.addSongToPlaylist(
      req.user.sub,
      Number(id),
      dto,
    );
  }

  @Delete(':id/songs/:songId')
  removeSong(
    @Req() req: any,
    @Param('id') id: string,
    @Param('songId') songId: string,
  ) {
    return this.playlistService.removeSongFromPlaylist(
      req.user.sub,
      Number(id),
      Number(songId),
    );
  }

  @Patch(':id')
  rename(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: { name: string },
  ) {
    return this.playlistService.renamePlaylist(
      req.user.sub,
      Number(id),
      body.name,
    );
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.playlistService.deletePlaylist(req.user.sub, Number(id));
  }
}
