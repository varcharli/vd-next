import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class ScraperItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: true})
  name: string;

  @Column({nullable: false})
  url: string;

  @Column({nullable: true})
  movieId:number;

  @Column({nullable: false,default:false})
  finished: boolean;
}

@Entity()
export class ScraperProject {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: false})
  name: string;

  @Column({nullable: true})
  count: number;

  @Column({nullable: true})
  description: string;

  @Column({nullable: false,default:false})
  finished: boolean;
}