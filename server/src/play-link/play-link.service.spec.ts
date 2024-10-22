import { Test, TestingModule } from '@nestjs/testing';
import { PlayLinkService } from './play-link.service';

describe('PlayLinkService', () => {
  let service: PlayLinkService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlayLinkService],
    }).compile();

    service = module.get<PlayLinkService>(PlayLinkService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
