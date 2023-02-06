import { Test, TestingModule } from '@nestjs/testing';
import { NotifierService } from './notifier.service';

describe('NotifierService', () => {
  let service: NotifierService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotifierService],
    }).compile();

    service = module.get<NotifierService>(NotifierService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
