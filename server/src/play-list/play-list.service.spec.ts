import { Test, TestingModule } from '@nestjs/testing';
import { PlayListService } from './play-list.service';

describe('PlayListService', () => {
  let service: PlayListService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlayListService],
    }).compile();

    service = module.get<PlayListService>(PlayListService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
