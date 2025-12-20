import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { User } from '../user/user.entity';
import { Song } from '../song/song.entity';

@Entity()
export class Playlist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => Song, { cascade: false })
  @JoinTable()
  songs: Song[];

  @ManyToMany(() => User, (user) => user.playlists, { cascade: false })
  @JoinTable()
  users: User[];
}
