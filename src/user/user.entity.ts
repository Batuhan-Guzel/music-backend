import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany } from 'typeorm';
import { Role } from '../role/role.entity';
import { Playlist } from '../playlist/playlist.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @ManyToOne(() => Role, { eager: true })
  role: Role;

  @ManyToMany(() => Playlist)
  playlists: Playlist[];
}
