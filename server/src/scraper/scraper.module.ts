import { Module } from '@nestjs/common';
import { ScraperService } from './scraper.service';
import { ScraperController } from './scraper.controller';
import { SettingService } from '@/setting/setting.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScraperProject,ScraperItem,ScraperLog } from './scraper.entity';
import { MovieService } from '@/movie/movie.service';
import { PlayListService } from '@/play-list/play-list.service';
import { ActorService } from '@/actor/actor.service';
import { GalleryService } from '@/gallery/gallery.service';
import { DownloadLinkService } from '@/download-link/download-link.service';
import { Movie } from '@/movie/movie.entity';
import { Actor } from '@/actor/actor.entity';
import { DownloadLink } from '@/download-link/download-link.entity';
import { Gallery } from '@/gallery/gallery.entity';
import { PlayList, PlayListItem } from '@/play-list/play-list.entity';
import { Setting } from '@/setting/entities/setting.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ScraperProject,ScraperItem,ScraperLog,Movie,
    PlayList,PlayListItem,Actor,Gallery,DownloadLink,Setting])],
  controllers: [ScraperController],
  providers: [ScraperService, SettingService,MovieService,PlayListService,
    ActorService,GalleryService,DownloadLinkService],
  exports: [ScraperService]
})
export class ScraperModule {}
