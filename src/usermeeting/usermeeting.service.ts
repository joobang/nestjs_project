import { Injectable, NotFoundException } from '@nestjs/common';
import { UserMeetingEntity } from './usermeeting.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { CreateUserMeetingDto } from './dto/create-usermeeting.dto';

@Injectable()
export class UserMeetingService {
    constructor(
        @InjectRepository(UserMeetingEntity)
        private readonly UserMeetingRepo: Repository<UserMeetingEntity>
    ){}

    async createUserMeeting(queryRunner: QueryRunner, user_id: number, meeting_id: number, role_id: number) {
        const createUserMeetingDto = new CreateUserMeetingDto();
        createUserMeetingDto.user_id = user_id;
        createUserMeetingDto.meeting_id = meeting_id;
        createUserMeetingDto.meeting_role_id = role_id;
        
        await queryRunner.manager.save(UserMeetingEntity, createUserMeetingDto);
        
        return;
    }

    async getUserMeeting(user_id: number, meeting_id: number){
        const userMeeting = await this.UserMeetingRepo.findOne({where:{user_id:user_id, meeting_id: meeting_id, isDel:'N'},relations:['role']})
        //console.log(userMeeting);
        if(!userMeeting){
            throw new NotFoundException('You are not join in this meeting.')
        }
        return userMeeting;
    }
}
