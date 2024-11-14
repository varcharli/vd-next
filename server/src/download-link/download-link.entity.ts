import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Movie } from '@/movie/movie.entity';

@Entity()
export class DownloadLink {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  url: string;

  @ManyToOne(() => Movie, movie => movie.downloadLinks)
  movie: Movie;
}