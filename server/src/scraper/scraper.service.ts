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

function cDate(date: string): Date {
  const tryInt = parseInt(date, 10);
  if (tryInt) {
    return new Date(tryInt);
  }
  console.log("cDate", date);
  const newDate = new Date(date);
  console.log("cDate to", newDate);
  return newDate;
}

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


  // export
  async pullActivedProjects(): Promise<ScraperProject[]> {
    const projects = await this.scraperProjectRepository.findBy({ finished: false });
    if (projects.length === 0) {
      const setting = await this.getSetting();
      const lastDateTime = new Date(setting.initEndDate);
      const currentTime = new Date();
      if (lastDateTime <= currentTime) {
        // const timeDifference = currentTime - lastDateTime;
        const hoursDifference = (currentTime.getTime() - lastDateTime.getTime()) / (1000 * 60 * 60)
        // timeDifference / (1000 * 60 * 60);
        if (hoursDifference > ScraperHour) {
          const project = new ScraperProject();
          project.name = keyInitProjectName;
          project.startDate = currentTime.toString();
          project.endDate = lastDateTime.toString();
          project.description = "auto project";
          project.finished = false;
          const newProject = await this.createProject(project);
          projects.push(newProject);
        }
      }
    }
    return projects;
  }



  // async finishProject(id: number): Promise<boolean> {
  //   await this.scraperProjectRepository.update(id, { finished: true });
  //   return true;
  // }

  // async updateProject(id: number, project: ScraperProject): Promise<boolean> {
  //   await this.scraperProjectRepository.update(id, project);
  //   return true;
  // }

  // export
  async pushProjectPage(projectId: number, page: number, movies: Movie[]): Promise<ScraperProject> {
    const project = await this.scraperProjectRepository.findOneBy({
      id: projectId,
      indexFinished: false,
      finished: false
    });
    if (!project) return null;

    const count = await this.generateIndexs(projectId, movies);

    console.log("startDate", project.startDate, "endDate", project.endDate);
    const minDate = cDate(project.endDate);
    const maxDate = cDate(project.startDate || project.endDate);
    const curMinDate = movies.reduce((min, p) => cDate(p.releaseDate) < min ? cDate(p.releaseDate) : min, new Date("2100-01-01"));
    const curMaxDate = movies.reduce((max, p) => cDate(p.releaseDate) > max ? cDate(p.releaseDate) : max, new Date('1900-01-01'));
    console.log("minDate", minDate, "maxDate", maxDate, "curMinDate", curMinDate, "curMaxDate", curMaxDate);
    project.indexFinished = (curMinDate < minDate);

    await this.scraperProjectRepository.update(projectId, {
      pageNumber: page,
      startDate: curMaxDate.toString(),
      count: project.count + count,
      indexFinished: project.indexFinished
    });

    return this.scraperProjectRepository.findOneBy({ id: projectId });
  }

  // export
  async pullProjectItems(projectId: number): Promise<ScraperItem[]> {
    return this.scraperItemRepository.findBy({ projectId, finished: false });
  }

  // Create movie and o2m,m2m fields
  // Return whether project is finished.
  // Validate project and item status.If project or item is finished, return null.
  async pushProjectItem(projectId: number, itemId: number, movie: Movie): Promise<boolean> {
    const project = await this.scraperProjectRepository.findOneBy({ id: projectId });
    if (!project) return null;
    if (project.finished) return null;
    const item = await this.scraperItemRepository.findOneBy({ id: itemId });
    if (!item) return null;
    if (item.finished) return null;

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

    return this.validateProjectFinished(projectId);
  }

  async validateProjectFinished(projectId: number): Promise<boolean> {
    const indexFinished = await this.scraperProjectRepository.exists({
      where: { id: projectId, indexFinished: true }
    });
    if (!indexFinished) return false;

    const itemsNotFinished = await this.scraperItemRepository.exists({ where: { projectId, finished: false } });
    if (!itemsNotFinished) {
      await this.scraperProjectRepository.update(projectId, { finished: true });
    }
    return !itemsNotFinished;
  }

  createProject(project: ScraperProject): Promise<ScraperProject> {
    return this.scraperProjectRepository.save(project);
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


  async createItem(projectId: number, movieId: number, url: string): Promise<ScraperItem> {
    const e = await this.scraperItemRepository.exists({ where: { projectId, movieId } });
    if (e) return null;

    return this.scraperItemRepository.save({
      name: keyInitProjectName,
      projectId,
      movieId,
      url,
      finished: false
    });
  }

  // return affected rows
  async generateIndexs(projectId: number, movies: Movie[]): Promise<number> {
    const items = await saveMovieIndexs({
      movies,
      movieRepository: this.movieRepository,
    });
    for (const item of items) {
      const newItem = await this.createItem(projectId, item.movieId, item.url);
    }
    return items.length;
  }

  // async findInitUnfinished(limit?: number, offset?: number): Promise<Movie[]> {
  //   const items = await this.scraperItemRepository.find({
  //     where: { finished: false, name: keyInitProjectName },
  //     take: limit,
  //     skip: offset,
  //   });

  //   return items.map(item => { return { id: item.movieId, fromUrl: item.url } as Movie });
  // }

}
