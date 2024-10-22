import { Test, TestingModule } from '@nestjs/testing';
import { PlayListController } from './play-list.controller';

describe('PlayListController', () => {
  let controller: PlayListController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayListController],
    }).compile();

    controller = module.get<PlayListController>(PlayListController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
