import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Playlist } from './playlist.entity';
import { User } from '../user/user.entity';
import { Song } from '../song/song.entity';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { AddSongDto } from './dto/add-song.dto';

@Injectable()
export class PlaylistService {
  constructor(
    @InjectRepository(Playlist)
    private readonly playlistRepo: Repository<Playlist>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Song)
    private readonly songRepo: Repository<Song>,
  ) {}

  private toId(v: any) {
    const n = Number(v);
    if (!Number.isFinite(n) || n <= 0) throw new BadRequestException('Invalid id');
    return n;
  }

  async createPlaylist(userId: number, dto: CreatePlaylistDto) {
    const uid = this.toId(userId);
    const name = dto.name?.trim();
    if (!name) throw new BadRequestException('name is required');

    const user = await this.userRepo.findOne({ where: { id: uid } });
    if (!user) throw new NotFoundException('User not found');

    const playlist = this.playlistRepo.create({ name, songs: [], users: [user] });
    return this.playlistRepo.save(playlist);
  }

  async myPlaylists(userId: number) {
    const uid = this.toId(userId);
    return this.playlistRepo
      .createQueryBuilder('playlist')
      .innerJoin('playlist.users', 'user', 'user.id = :userId', { userId: uid })
      .leftJoinAndSelect('playlist.songs', 'song')
      .leftJoinAndSelect('song.album', 'album')
      .leftJoinAndSelect('album.artist', 'artist')
      .orderBy('playlist.id', 'DESC')
      .getMany();
  }

  async addSongToPlaylist(userId: number, playlistId: number, dto: AddSongDto) {
    const uid = this.toId(userId);
    const pid = this.toId(playlistId);
    const sid = this.toId(dto.songId);

    const playlist = await this.playlistRepo.findOne({
      where: { id: pid },
      relations: ['users', 'songs'],
    });
    if (!playlist) throw new NotFoundException('Playlist not found');

    const isOwner = playlist.users.some((u) => u.id === uid);
    if (!isOwner) throw new ForbiddenException('This playlist is not yours');

    const song = await this.songRepo.findOne({ where: { id: sid } });
    if (!song) throw new NotFoundException('Song not found');

    const exists = playlist.songs.some((s) => s.id === sid);
    if (exists) return playlist;

    playlist.songs.push(song);
    return this.playlistRepo.save(playlist);
  }

  async removeSongFromPlaylist(userId: number, playlistId: number, songId: number) {
    const uid = this.toId(userId);
    const pid = this.toId(playlistId);
    const sid = this.toId(songId);

    const playlist = await this.playlistRepo.findOne({
      where: { id: pid },
      relations: ['users', 'songs'],
    });
    if (!playlist) throw new NotFoundException('Playlist not found');

    const isOwner = playlist.users.some((u) => u.id === uid);
    if (!isOwner) throw new ForbiddenException('This playlist is not yours');

    playlist.songs = (playlist.songs ?? []).filter((s) => s.id !== sid);
    return this.playlistRepo.save(playlist);
  }

  async renamePlaylist(userId: number, playlistId: number, name: string) {
    const uid = this.toId(userId);
    const pid = this.toId(playlistId);
    const n = name?.trim();
    if (!n) throw new BadRequestException('name is required');

    const playlist = await this.playlistRepo.findOne({
      where: { id: pid },
      relations: ['users'],
    });
    if (!playlist) throw new NotFoundException('Playlist not found');

    const isOwner = playlist.users.some((u) => u.id === uid);
    if (!isOwner) throw new ForbiddenException('This playlist is not yours');

    playlist.name = n;
    return this.playlistRepo.save(playlist);
  }

  async deletePlaylist(userId: number, playlistId: number) {
    const uid = this.toId(userId);
    const pid = this.toId(playlistId);

    const playlist = await this.playlistRepo.findOne({
      where: { id: pid },
      relations: ['users'],
    });
    if (!playlist) throw new NotFoundException('Playlist not found');

    const isOwner = playlist.users.some((u) => u.id === uid);
    if (!isOwner) throw new ForbiddenException('This playlist is not yours');

    await this.playlistRepo.remove(playlist);
    return { message: 'Playlist deleted' };
  }
}
