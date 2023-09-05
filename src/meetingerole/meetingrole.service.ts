import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { MeetingRoleEntity } from './meetingrole.entity';
import { CreateMeetingRoleDto } from './dto/create-meetingrole.dto';

@Injectable()
export class MeetingRoleService {
    constructor(
        @InjectRepository(MeetingRoleEntity)
        private readonly MeetingRoleRepo: Repository<MeetingRoleEntity>
    ){}

    // 공간의 권한 타입 별 공간 권한 생성
    async createMeetingRoleByMeeting(queryRunner: QueryRunner, meeting_id: number, admin_array: Array<string>, common_array: Array<string>, owner_role :string){
        let meetingRoleid = 0;
        for(let i = 0; i<admin_array.length; i++){
            const createMeetingRoleDto = new CreateMeetingRoleDto();
            createMeetingRoleDto.meeting_id = String(meeting_id);
            createMeetingRoleDto.role_name = admin_array[i];
            createMeetingRoleDto.role_type = 'Admin'
            
            const meetingRole = await queryRunner.manager.save(MeetingRoleEntity, createMeetingRoleDto);
            if(admin_array[i] === owner_role){
                meetingRoleid = meetingRole.id;
            }
        }

        for(let i = 0; i<common_array.length; i++){
            const createMeetingRoleDto = new CreateMeetingRoleDto();
            createMeetingRoleDto.meeting_id = String(meeting_id);
            createMeetingRoleDto.role_name = common_array[i];
            createMeetingRoleDto.role_type = 'Common'
            
            const meetingRole = await queryRunner.manager.save(MeetingRoleEntity, createMeetingRoleDto);
        }

        return meetingRoleid;
    }

    // 공간 참여시 
    // async createMeetingRoleByJoin(queryRunner: QueryRunner, meeting_id: number, role_name: string, role_type:string){
    //     const createMeetingRoleDto = new CreateMeetingRoleDto();
    //     createMeetingRoleDto.meeting_id = String(meeting_id);
    //     createMeetingRoleDto.role_name = role_name;
    //     createMeetingRoleDto.role_type = role_type;
        
    //     const meetingRole = await queryRunner.manager.save(MeetingRoleEntity, createMeetingRoleDto);
    //     return meetingRole.id;
    // }
    
}
