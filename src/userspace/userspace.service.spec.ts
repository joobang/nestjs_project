import { Test, TestingModule } from '@nestjs/testing';
import { UserSpaceService } from './userspace.service';

describe('UserSpaceService', () => {
  let service: UserSpaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserSpaceService],
    }).compile();

    service = module.get<UserSpaceService>(UserSpaceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
