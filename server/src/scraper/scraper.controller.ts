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
    return this.scraperService.getActivedProjects();
  }

  @Post('projects/:id')
  updateProject(@Param('id') id: number, @Body() project: ScraperProject): Promise<boolean> {
    const p=new ScraperProject();
    p.startDate=project.startDate;
    p.pageNumber=project.pageNumber;
    p.count=project.count;
    p.description=project.description;
    return this.scraperService.updateProject(id,p);
  }
  
  @Post('projects/:id/generate')
  generateIndexs(@Param('id') projectId: number, @Body() movies: Movie[]): Promise<number> {
    return this.scraperService.generateIndexs(projectId, movies);
  }

  @Get('projects/:id/items')
  getItems(@Param('id') id: number): Promise<ScraperItem[]> {
    return this.scraperService.getProjectUnfinishedItems(id);
  }

  @Post('items/:id/generate')
  generate(@Param('id') itemId: number, @Body() movie: Movie): Promise<number> {
    // return movie id
    // this will create or update movie by sn.
    return this.scraperService.generate(itemId, movie);
  }

  @Post('projects/:id/finish')
  finishProject(@Param('id') id: number): Promise<boolean> {
    return this.scraperService.finishProject(id);
  }

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

  @Post('log')
  log(@Body() log: string): Promise<ScraperLog> {
    return this.scraperService.log(log, 'scraper');
  }
}
