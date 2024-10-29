import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, ManyToOne } from 'typeorm';
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

    @ManyToMany(() => Movie)
    @JoinTable()
    movies: Movie[];

    @ManyToOne(() => User, user => user.playlists)
    user: User;

    @Column({default: false})
    isSys: boolean;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
}
