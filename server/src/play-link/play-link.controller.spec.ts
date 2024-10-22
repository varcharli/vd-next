import { Test, TestingModule } from '@nestjs/testing';
import { PlayLinkController } from './play-link.controller';

describe('PlayLinkController', () => {
  let controller: PlayLinkController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayLinkController],
    }).compile();

    controller = module.get<PlayLinkController>(PlayLinkController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
