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

  async createPlaylist(userId: number, dto: CreatePlaylistDto) {
    const name = dto.name?.trim();
    if (!name) throw new BadRequestException('name is required');

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const playlist = this.playlistRepo.create({
      name,
      songs: [],
      users: [user],
    });

    return this.playlistRepo.save(playlist);
  }

  async myPlaylists(userId: number) {
    return this.playlistRepo
      .createQueryBuilder('playlist')
      .leftJoin('playlist.users', 'user')
      .leftJoinAndSelect('playlist.songs', 'song')
      .leftJoinAndSelect('song.album', 'album')
      .leftJoinAndSelect('album.artist', 'artist')
      .where('user.id = :userId', { userId })
      .orderBy('playlist.id', 'DESC')
      .getMany();
  }

  async addSongToPlaylist(userId: number, playlistId: number, dto: AddSongDto) {
    const playlist = await this.playlistRepo.findOne({
      where: { id: playlistId },
      relations: ['users', 'songs'],
    });
    if (!playlist) throw new NotFoundException('Playlist not found');

    const isOwner = playlist.users.some((u) => u.id === userId);
    if (!isOwner) throw new ForbiddenException('This playlist is not yours');

    const song = await this.songRepo.findOne({ where: { id: dto.songId } });
    if (!song) throw new NotFoundException('Song not found');

    if (playlist.songs.some((s) => s.id === song.id)) {
      return playlist;
    }

    playlist.songs.push(song);
    return this.playlistRepo.save(playlist);
  }

  async removeSongFromPlaylist(
    userId: number,
    playlistId: number,
    songId: number,
  ) {
    const playlist = await this.playlistRepo.findOne({
      where: { id: playlistId },
      relations: ['users', 'songs'],
    });
    if (!playlist) throw new NotFoundException('Playlist not found');

    const isOwner = playlist.users.some((u) => u.id === userId);
    if (!isOwner) throw new ForbiddenException('This playlist is not yours');

    playlist.songs = playlist.songs.filter((s) => s.id !== songId);
    return this.playlistRepo.save(playlist);
  }

  async renamePlaylist(userId: number, playlistId: number, name: string) {
    const playlist = await this.playlistRepo.findOne({
      where: { id: playlistId },
      relations: ['users'],
    });
    if (!playlist) throw new NotFoundException('Playlist not found');

    const isOwner = playlist.users.some((u) => u.id === userId);
    if (!isOwner) throw new ForbiddenException('This playlist is not yours');

    const n = name?.trim();
    if (!n) throw new BadRequestException('name is required');

    playlist.name = n;
    return this.playlistRepo.save(playlist);
  }

  async deletePlaylist(userId: number, playlistId: number) {
    const playlist = await this.playlistRepo.findOne({
      where: { id: playlistId },
      relations: ['users'],
    });
    if (!playlist) throw new NotFoundException('Playlist not found');

    const isOwner = playlist.users.some((u) => u.id === userId);
    if (!isOwner) throw new ForbiddenException('This playlist is not yours');

    await this.playlistRepo.remove(playlist);
    return { message: 'Playlist deleted' };
  }
}
