import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeetingEntity } from './meeting.entity';
import { MeetingController } from './meeting.controller';
import { MeetingService } from './meeting.service';
import { UserMeetingEntity } from 'src/usermeeting/usermeeting.entity';
import { MeetingRoleEntity } from 'src/meetingerole/meetingrole.entity';
import { UserMeetingModule } from 'src/usermeeting/usermeeting.module';
import { MeetingRoleModule } from 'src/meetingerole/meetingrole.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([MeetingEntity, UserMeetingEntity, MeetingRoleEntity]),
        UserMeetingModule,
        MeetingRoleModule
    ],
    controllers: [MeetingController],
    providers: [MeetingService],
    exports: [MeetingService]
})
export class MeetingModule {}
