import { Test, TestingModule } from '@nestjs/testing';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';
import { getModelToken } from '@nestjs/mongoose';
import { Video } from './video.schema';

describe('VideoController', () => {
  let controller: VideoController;
  let service: VideoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VideoController],
      providers: [
        VideoService,
        {
          provide: getModelToken('Video'),
          useValue: {
            find: jest.fn(),
            findById: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<VideoController>(VideoController);
    service = module.get<VideoService>(VideoService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

});
