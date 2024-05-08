import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { VideoService } from './video.service';
import { Video } from './video.schema';
import { Model } from 'mongoose';

describe('VideoService', () => {
  let service: VideoService;
  let model: Model<Video>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<VideoService>(VideoService);
    model = module.get<Model<Video>>(getModelToken('Video'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

});
