import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToMany, ManyToOne, Index } from 'typeorm';
import { Director } from '../director/director.entity';
import { Actor } from '../actor/actor.entity';
import { Tag } from '../tag/tag.entity';
import { PlayLink } from '../play-link/play-link.entity';
import { PlayList, PlayListItem } from '../play-list/play-list.entity';
import { Gallery } from '../gallery/gallery.entity';
import { DownloadLink } from '@/download-link/download-link.entity';

// Movie Entity
@Entity()
export class Movie {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: true })
    description: string;

    @Index()
    @Column({ nullable: true })
    sn: string;

    @Column({ nullable: true })
    posterUrl: string;

    @Column({ nullable: true })
    largePosterUrl: string;

    @Index()
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

    @ManyToOne(() => PlayListItem, playListItem => playListItem.movie)
    playListItems: PlayListItem[];

    @OneToMany(() => PlayLink, playLink => playLink.movie)
    playLinks: PlayLink[];

    @OneToMany(() => Gallery, gallery => gallery.movie)
    galleries: Gallery[];

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ nullable: true })
    fromUrl: string;

    @Column({ nullable: true, type: 'timestamp' })
    updateAt: Date;

    @OneToMany(() => DownloadLink, downloadLink => downloadLink.movie)
    downloadLinks: DownloadLink[];
}
