import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeetingRoleEntity } from './meetingrole.entity';
import { MeetingRoleService } from './meetingrole.service';
import { UserMeetingEntity } from 'src/usermeeting/usermeeting.entity';

@Module({
    imports: [TypeOrmModule.forFeature([MeetingRoleEntity, UserMeetingEntity])],
    providers: [MeetingRoleService],
    exports: [MeetingRoleService]
})
export class MeetingRoleModule {}
