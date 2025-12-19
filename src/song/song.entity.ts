import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Album } from '../album/album.entity';

@Entity()
export class Song {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @ManyToOne(() => Album, (album) => album.songs, { eager: true })
  album: Album;
}
