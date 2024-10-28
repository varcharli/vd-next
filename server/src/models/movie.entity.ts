// 添加一个movie表，
// 字段:名称，简介，发行序号，海报URL，大张海报URL，发行日期，导演（m2m)，演员(m2m),tags(m2m),
// 播放链接(o2m),播放列表(m2m)，电影图片URL(o2m)，创建时间。添加director表，字段：名称，简介，照片URL。
// 添加actor表，字段：名称，简介，照片URL。添加playLink表（播放链接），字段：名称，URL。
// 添加playList表（播放列表），字段：名称，总数，海报URL。
// 添加gallerey表（电影图片），字段：URL。

import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToMany, ManyToOne } from 'typeorm';

// Movie Entity
@Entity()
export class Movie {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true })
    sn: string;

    @Column({ nullable: true })
    posterUrl: string;

    @Column({ nullable: true })
    largePosterUrl: string;

    @Column({ nullable: true })
    releaseDate: string;

    @ManyToMany(() => Director)
    @JoinTable()
    directors: Director[];

    @ManyToMany(() => Actor)
    @JoinTable()
    actors: Actor[];

    @ManyToMany(() => Tag)
    @JoinTable()
    tags: Tag[];

    @OneToMany(() => PlayLink, playLink => playLink.movie)
    playLinks: PlayLink[];

    @ManyToMany(() => PlayList)
    @JoinTable()
    playLists: PlayList[];

    @OneToMany(() => Gallery, gallery => gallery.movie)
    galleries: Gallery[];

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}

// Director Entity
@Entity()
export class Director {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true })
    photoUrl: string;
}

// Actor Entity
@Entity()
export class Actor {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true })
    photoUrl: string;
}

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