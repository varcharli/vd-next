import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Unique } from 'typeorm';


@Entity()
@Unique(['projectId', 'movieId'])
export class ScraperItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    projectId: number;

    @Column({ nullable: true })
    name: string;

    @Column({ nullable: false })
    url: string;

    @Column({ nullable: true })
    movieId: number;

    @Column({ nullable: false, default: false })
    finished: boolean;
}

@Entity()
export class ScraperProject {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: false })
    startDate: string;

    @Column({ nullable: false })
    endDate: string;

    @Column({ nullable: true })
    pageNumber: number;

    @Column({ nullable: true })
    count: number;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: false, default: false })
    indexFinished: boolean;

    @Column({ nullable: false, default: false })
    finished: boolean;
}

@Entity()
export class ScraperLog{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: false })
    log: string;

    @Column({ nullable: false })
    time: string;
}