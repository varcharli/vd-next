import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, Unique } from 'typeorm';
import { Movie } from '../movie/movie.entity';
import { User } from '../user/user.entity';
// PlayList Entity
@Entity()
export class PlayList {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: false, default: 0 })
    totalCount: number;

    @Column({ nullable: true })
    posterUrl: string;

    @OneToMany(() => PlayListItem, item => item.playList)
    items: PlayListItem[];

    @ManyToOne(() => User, user => user.playlists)
    user: User;

    @Column({ default: false })
    isSys: boolean;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
}

@Entity()
@Unique(['playList', 'movie'])
export class PlayListItem {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => PlayList, playList => playList.items)
    playList: PlayList;

    @ManyToOne(() => Movie, movie => movie.playListItems)
    movie: Movie;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createAt: Date;
}

