import { Injectable } from '@nestjs/common';
import { ScraperItem,ScraperProject } from './scraper.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ScraperService {
  constructor(
    @InjectRepository(ScraperItem)
    private readonly scraperItemRepository: Repository<ScraperItem>,
    @InjectRepository(ScraperProject)
    private readonly scraperProjectRepository: Repository<ScraperProject>,
  ) {}

  createProject( project: ScraperProject): Promise<ScraperProject> {
    return this.scraperProjectRepository.save(project);
  }

  

}
