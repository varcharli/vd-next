import { Injectable } from '@nestjs/common';
import { ScraperItem, ScraperProject } from './scraper.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from '@/movie/movie.entity';
import { PlayList, PlayListItem } from '@/play-list/play-list.entity';
import { ActorService } from '@/actor/actor.service';
import { DownloadLink } from '@/download-link/download-link.entity';
import { DownloadLinkService } from '@/download-link/download-link.service';
import { GalleryService } from '@/gallery/gallery.service';
import { PlayListService } from '@/play-list/play-list.service';
import { SettingService } from '@/setting/setting.service';
import { ScraperSetting } from './dto/scraper.dto';
import { ScraperLog } from './scraper.entity';

import { saveOneMovie, getUnfinishedMovies, saveMovieIndexs } from './movieScraper';

const keyInitProjectName = "init";
const keyInitLastPage = "ScraperInitLastPage";
const keyInitEndDate = "ScraperInitEndDate";
const keyInitFinished = "ScraperInitFinished";
const ScraperHour = 24;


@Injectable()
export class ScraperService {
  constructor(
    @InjectRepository(ScraperItem)
    private readonly scraperItemRepository: Repository<ScraperItem>,
    @InjectRepository(ScraperProject)
    private readonly scraperProjectRepository: Repository<ScraperProject>,
    @InjectRepository(ScraperLog)
    private readonly scraperLogRepository: Repository<ScraperLog>,
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    @InjectRepository(PlayList)
    private readonly playListRepository: Repository<PlayList>,
    @InjectRepository(PlayListItem)
    private readonly playListItemRepository: Repository<PlayListItem>,
    @InjectRepository(DownloadLink)
    private readonly downloadLinkRepository: Repository<DownloadLink>,
    private readonly downloadLinkService: DownloadLinkService,

    private readonly playListService: PlayListService,
    private readonly actorService: ActorService,
    private readonly galleryService: GalleryService,
    private readonly settingService: SettingService
  ) { }

  createProject(project: ScraperProject): Promise<ScraperProject> {
    return this.scraperProjectRepository.save(project);
  }

  async getActivedProjects(): Promise<ScraperProject[]> {
    const projects=await this.scraperProjectRepository.findBy({ finished: false });
    if(projects.length===0){
      const setting = await this.getSetting();
      const lastDateTime = new Date(setting.initEndDate).getTime();
      const currentTime = new Date().getTime();
      if (lastDateTime <= currentTime) {
        const timeDifference = currentTime - lastDateTime;
        const hoursDifference = timeDifference / (1000 * 60 * 60);
        if(hoursDifference>ScraperHour){
          const project = new ScraperProject();
          project.name = keyInitProjectName;
          project.startDate = currentTime.toString();
          project.endDate=lastDateTime.toString();
          project.description="auto project";
          project.finished=false;
          const newProject= await this.createProject(project);
          projects.push(newProject);
        }
      }
    }
    return projects;
  }

  async getProjectUnfinishedItems(projectId: number): Promise<ScraperItem[] > {
    return this.scraperItemRepository.findBy({ projectId, finished: false });
  }

  async finishProject(id: number): Promise<boolean> {
    await this.scraperProjectRepository.update(id, { finished: true });
    return true;
  }

  async updateProject(id: number, project: ScraperProject): Promise<boolean> {
    await this.scraperProjectRepository.update(id, project);
    return true;
  }

  createItem(projectId: number, movieId: number, url: string): Promise<ScraperItem> {
    return this.scraperItemRepository.save({
      name: keyInitProjectName,
      projectId,
      movieId,
      url,
      finished: false
    });
  }

  async finishItem(id: number): Promise<boolean> {
    const item = await this.scraperItemRepository.findOneBy({ id });
    item.finished = true;
    await this.scraperItemRepository.update(id, item);
    return true;
  }

  async log(log: string, name?: string): Promise<ScraperLog> {
    const time = (new Date()).toISOString();
    name = name || "default";
    return this.scraperLogRepository.save({
      log, name, time
    } as ScraperLog);
  }

  async getSetting() {
    const setting = new ScraperSetting();
    setting.initEndDate = (await this.settingService.loadSetting(keyInitEndDate)) || "2023-07-29";
    setting.initLastPage = parseInt(await this.settingService.loadSetting(keyInitLastPage), 10);
    setting.initFinished = (await this.settingService.loadSetting(keyInitFinished)) === "true";
    return setting;
  }

  // create movie and o2m,m2m fields
  async generate(itemId: number, movie: Movie) {
    // if (await this.exists(movie.sn)) {
    //   return null;
    // }
    const re = await saveOneMovie(
      {
        movie,
        movieRepository: this.movieRepository,
        actorService: this.actorService,
        downloadLinkService: this.downloadLinkService,
        galleryService: this.galleryService
      });

    if (re) {
      await this.finishItem(itemId);
    }

    return re;
  }

  // return affected rows
  async generateIndexs(projectId: number, movies: Movie[]): Promise<number> {
    const items = await saveMovieIndexs({
      movies,
      movieRepository: this.movieRepository,
    });
    for (const item of items) {
      await this.createItem(projectId, item.movieId, item.url);
    }
    return items.length;
  }

  async findInitUnfinished(limit?: number, offset?: number): Promise<Movie[]> {
    const items = await this.scraperItemRepository.find({
      where: { finished: false, name: keyInitProjectName },
      take: limit,
      skip: offset,
    });

    return items.map(item => { return { id: item.movieId, fromUrl: item.url } as Movie });
  }

}
