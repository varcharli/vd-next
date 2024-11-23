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

// format all date to yyyy-mm-dd
function cDate(date: any, nullDate: string = "1900-01-01"): string {
  if (!date) return nullDate;
  if (typeof date === "string") {
    if (date.length === 10) return date;
    if (date.length === 19) return date.slice(0, 10);
    return nullDate;
  }
  if (typeof date === "number") return new Date(date).toISOString().slice(0, 10);
  if (date instanceof Date) return date.toISOString().slice(0, 10);
  return nullDate;
}

function cTime(date: string): number {
  const d = new Date(date);
  return d.getTime();
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
    console.log("pullActivedProjects", projects.length);
    if (projects.length === 0) {
      // get max startDate from scraperProject
      const query = await this.scraperProjectRepository.query(`select max("startDate") as date from scraper_project`);
      let maxStartDate = "";
      if (query && query.length > 0) {
        maxStartDate = query[0].date;
      }
      console.log("maxStartDate", maxStartDate, 'query', query);
      const setting = await this.getSetting();
      const lastDateTime = maxStartDate ? maxStartDate : cDate(setting.initEndDate);
      const currentTime = cDate(new Date());
      console.log("create auto project: lastDateTime", lastDateTime, "currentTime", currentTime);
      if (lastDateTime <= currentTime) {
        // const timeDifference = currentTime - lastDateTime;
        const hoursDifference = (cTime(currentTime) - cTime(lastDateTime)) / (1000 * 60 * 60)
        // timeDifference / (1000 * 60 * 60);
        if (hoursDifference > ScraperHour) {
          const project = new ScraperProject();
          project.name = keyInitProjectName;
          project.startDate = "";
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
    const curMinDate = movies.reduce((min, p) => cDate(p.releaseDate, "2100-01-01") < min ? cDate(p.releaseDate) : min, "2100-01-01");
    const curMaxDate = movies.reduce((max, p) => cDate(p.releaseDate, "1900-01-01") > max ? cDate(p.releaseDate) : max, "1900-01-01");
    console.log("page", page, "minDate", minDate, "maxDate", maxDate, "curMinDate", curMinDate, "curMaxDate", curMaxDate);
    project.indexFinished = (curMinDate < minDate);
    // refresh startDate with project max date
    if (curMaxDate > maxDate) {
      project.startDate = curMaxDate;
    }
    await this.scraperProjectRepository.update(projectId, {
      pageNumber: page,
      startDate: project.startDate,
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
    try {
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
    } catch (e) {
      // internal error still finish item and mark error message to item name
      await this.finishItem(itemId, "internal error");
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

  async finishItem(id: number, error?: string): Promise<boolean> {
    const item = await this.scraperItemRepository.findOneBy({ id });
    item.finished = true;
    if (error) {
      item.name = error;
    }
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
