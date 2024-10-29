import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { Movie } from '../movie/movie.entity';
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
}
