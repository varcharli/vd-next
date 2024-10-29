import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Movie } from '../movie/movie.entity';

// Gallery Entity
@Entity()
export class Gallery {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    url: string;

    @ManyToOne(() => Movie, movie => movie.galleries)
    movie: Movie;
}
