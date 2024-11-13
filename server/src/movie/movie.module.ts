// src/movie/movie.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieService } from './movie.service';
import { Movie } from './movie.entity';
import { MovieController } from './movie.controller';
import { PlayList,PlayListItem } from 'src/play-list/play-list.entity';
import { PlayListService } from 'src/play-list/play-list.service';
import { ActorService } from 'src/actor/actor.service';
import { Actor } from 'src/actor/actor.entity';
import { GalleryService } from 'src/gallery/gallery.service';
import { Gallery } from 'src/gallery/gallery.entity';


@Module({
    imports: [TypeOrmModule.forFeature([Movie,PlayList,PlayListItem,Actor,Gallery])],
    providers: [MovieService,PlayListService,ActorService,GalleryService],
    controllers: [MovieController],
    exports: [MovieService],
})

export class MovieModule { }