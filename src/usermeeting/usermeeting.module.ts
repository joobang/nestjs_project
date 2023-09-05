import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserMeetingEntity } from './usermeeting.entity';
import { UserMeetingService } from './usermeeting.service';

@Module({
    imports: [TypeOrmModule.forFeature([UserMeetingEntity])],
    providers: [UserMeetingService],
    exports: [UserMeetingService]
})
export class UserMeetingModule {}
