import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Movie } from '../movie/movie.entity';
// PlayLink Entity
@Entity()
export class PlayLink {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: false })
    url: string;

    @ManyToOne(() => Movie, movie => movie.playLinks)
    movie: Movie;
}
