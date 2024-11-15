import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Movie } from '@/movie/movie.entity';

@Entity()
export class DownloadLink {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: true})
  name: string;

  @Column({nullable: true})
  url: string;

  @Column({nullable: true})
  size: string;

  @Column({nullable: true})
  date: string;

  @ManyToOne(() => Movie, movie => movie.downloadLinks)
  movie: Movie;
}