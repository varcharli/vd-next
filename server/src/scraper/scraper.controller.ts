import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ScraperService } from './scraper.service';
import { Movie } from '@/movie/movie.entity';
import { Injectable, Query } from '@nestjs/common';
import { ScraperItem, ScraperLog, ScraperProject } from './scraper.entity';

@Controller('scraper')
export class ScraperController {
  constructor(private readonly scraperService: ScraperService) { }

  // Auto generate projects.Dont need to create project manually.
  // @Post('projects')
  // createProject(@Body() project: ScraperProject): Promise<ScraperProject> {
  //   return this.scraperService.createProject(project);
  // }

  @Get('projects')
  getActivedProjects(): Promise<ScraperProject[]> {
    return this.scraperService.pullActivedProjects();
  }

  // @Post('projects/:id')
  // updateProject(@Param('id') id: number, @Body() project: ScraperProject): Promise<boolean> {
  //   const p=new ScraperProject();
  //   p.startDate=project.startDate;
  //   p.pageNumber=project.pageNumber;
  //   p.count=project.count;
  //   p.description=project.description;
  //   return this.scraperService.updateProject(id,p);
  // }

  @Post('projects/:id/pages/:pageNumber')
  pushProjectPage(@Param('id') projectId: number, @Param('pageNumber') pageNumber,
    @Body() movies: Movie[]): Promise<ScraperProject> {
    return this.scraperService.pushProjectPage(projectId, pageNumber, movies);
    // return this.scraperService.generateIndexs(projectId, movies);
  }

  @Get('projects/:id/items')
  pullProjectItems(@Param('id') id: number): Promise<ScraperItem[]> {
    return this.scraperService.pullProjectItems(id);
  }

  @Post('projects/:id/items/:itemId')
  pushProjectItem(@Param('id') projectId, @Param('itemId') itemId: number, 
    @Body() movie: Movie): Promise<boolean> {
    // return movie id
    // this will create or update movie by sn.
    return this.scraperService.pushProjectItem(projectId, itemId, movie);
  }

  // @Post('projects/:id/finish')
  // finishProject(@Param('id') id: number): Promise<boolean> {
  //   return this.scraperService.finishProject(id);
  // }

  // @Get('setting')
  // getSetting() {
  //   return this.scraperService.getSetting();
  // }





  // @Get('unfinished')
  // findUnfinishedMovies(@Query('limit') limit?: number, @Query('offset') offset?: number): 
  //   Promise<Movie[]> {
  //   return this.scraperService.findInitUnfinished (
  //     limit, 
  //     offset,);
  // }

  @Post('logs')
  pushLog(@Body() log: ScraperLog ): Promise<ScraperLog> {
    return this.scraperService.pushLog(log.log, 'scraper');
  }

  @Get('logs/:id')
  pullLog(@Param('id') id: number): Promise<ScraperLog> {
    return this.scraperService.pullLog(id);
  }

  // params: {limit, offset, name} 
  @Get('logs')
  pullLogs(@Query('name') name?: string, @Query('limit') limit?: number, @Query('offset') offset?: number): Promise<[ScraperLog[],number]> {
    return this.scraperService.pullLogs(name, limit, offset);
  }

  @Post('logs/:id')
  updateLog(@Param('id') id: number, @Body() log: ScraperLog): Promise<boolean> {
    return this.scraperService.updateLog(id, log);
  }
}
