import { Test, TestingModule } from '@nestjs/testing';
import { ProcessQueueService } from './process_queue.service';

describe('ProcessQueueService', () => {
  let service: ProcessQueueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProcessQueueService],
    }).compile();

    service = module.get<ProcessQueueService>(ProcessQueueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
