import { Test, TestingModule } from '@nestjs/testing';
import { UserMeetingService } from './usermeeting.service';

describe('UserMeetingService', () => {
  let service: UserMeetingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserMeetingService],
    }).compile();

    service = module.get<UserMeetingService>(UserMeetingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
