import { Test, TestingModule } from '@nestjs/testing';
import { OffsetService } from './offset.service';

describe('OffsetService', () => {
  let service: OffsetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OffsetService],
    }).compile();

    service = module.get<OffsetService>(OffsetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
