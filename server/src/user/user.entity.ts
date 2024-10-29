import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { PlayList } from '../play-list/play-list.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true,nullable: false})
    name: string;

    @Column({nullable: false})
    passwordHashed: string;

    @Column({default: false})
    isAdmin: boolean;

    @OneToMany(() => PlayList, playlist => playlist.user)
    playlists: PlayList[];

}