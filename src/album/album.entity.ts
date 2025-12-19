import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Artist } from '../artist/artist.entity';
import { Song } from '../song/song.entity';

@Entity()
export class Album {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @ManyToOne(() => Artist, (artist) => artist.albums, { eager: true })
  artist: Artist;

  @OneToMany(() => Song, (song) => song.album)
  songs: Song[];
}
