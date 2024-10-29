import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Movie } from '../movie/movie.entity';
// Tag Entity (Assuming you need a Tag entity for the tags field in Movie)
@Entity()
export class Tag {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    name: string;

    @ManyToMany(()=>Movie )
    @JoinTable()
    movies:Movie[];
}
