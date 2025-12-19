import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Album } from '../album/album.entity';

@Entity()
export class Artist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Album, album => album.artist)
  albums: Album[];
}
