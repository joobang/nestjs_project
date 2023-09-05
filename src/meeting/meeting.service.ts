import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, QueryRunner, Repository } from 'typeorm';
import { MeetingEntity } from './meeting.entity';
import { JoinMeetingDto } from './dto/join-meeting.dto';
import { DeleteRoleDto } from './dto/delete-role.dto';
import { UserMeetingEntity } from 'src/usermeeting/usermeeting.entity';
import { MeetingRoleEntity } from 'src/meetingerole/meetingrole.entity';
import { MeetingRoleService } from 'src/meetingerole/meetingrole.service';import { CreateMeetingDto } from './dto/create-meeting.dto';
import { CreateMeetingParamDto } from './dto/create-param.dto';
import { DeleteMeetingDto } from './dto/delete-meeting.dto';
import { UserMeetingService } from 'src/usermeeting/usermeeting.service';

@Injectable()
export class MeetingService {
    constructor(
        @InjectRepository(MeetingEntity) private readonly MeetingRepo: Repository<MeetingEntity>,
        @InjectRepository(UserMeetingEntity) private userMeetingRepo: Repository<UserMeetingEntity>,
        @InjectRepository(MeetingRoleEntity) private meetingRoleRepo: Repository<MeetingRoleEntity>,
        
        private readonly connection: Connection,
        private readonly userMeetingService: UserMeetingService,
        private readonly meetingRoleService: MeetingRoleService
    ){}
    
    // 참여코드 난수 생성 함수
    createRandomCode(length: number) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i<length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        
        return result;
    }

    // 관리자 코드와 참여자 코드 생성과 중복 체크 
    async checkCode(queryRunner: QueryRunner, createMeetingDto: CreateMeetingDto){
        let isUnique = false;
        let admin_code = '';
        let common_code = '';
        
        while(!isUnique) {
            const randomCode = this.createRandomCode(8);
            const adminCodeExist = await queryRunner.manager.findOne(MeetingEntity, {where: [{common_code: randomCode},{admin_code: randomCode}]});
            if(!adminCodeExist){
                isUnique = true;
                admin_code = randomCode;
            }
        }

        isUnique = false;
        while(!isUnique) {
            const randomCode = this.createRandomCode(8);
            const adminCodeExist = await queryRunner.manager.findOne(MeetingEntity, {where: [{common_code: randomCode},{admin_code: randomCode}]});
            if(!adminCodeExist){
                isUnique = true;
                common_code = randomCode;
            }
        }

        createMeetingDto.admin_code = admin_code;
        createMeetingDto.common_code = common_code;
        return createMeetingDto;

    }
    // 공간 등록 API
    /*
        1. SPACE 테이블 등록작업
            1.1 관리자, 참여자 코드 난수 생성 및 중복 확인 로직
            1.2 공간 저장
        2. SPACEROLE 테이블 등록작업
            2.1 관리자명 목록, 참여자명 목록 별로 등록
        3. USERSPACE 테이블 등록작업
            3.1 공간 생성(owner)자 id, meetingrole id, meeting id 등록
    */
    async createMeeting(id: number, createMeetingParamDto: CreateMeetingParamDto) {
        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();

        await queryRunner.startTransaction();
        try {
            const { admin_array, common_array, owner_role, ...body} = createMeetingParamDto
            const createMeetingDto = new CreateMeetingDto();
            createMeetingDto.meeting_name = body.meeting_name;
            createMeetingDto.owner_id = String(id);
            createMeetingDto.meeting_logo_path = body.meeting_logo_path;
            // 관리자, 참여자 코드 생성 및 중복 검사
            await this.checkCode(queryRunner, createMeetingDto);
            // 공간 등록
            const meeting = await queryRunner.manager.save(MeetingEntity, createMeetingDto);
            // 공간역할 등록
            const meeting_id = meeting.id;
            const meetingRole_id = await this.meetingRoleService.createMeetingRoleByMeeting(queryRunner, meeting_id, admin_array, common_array, owner_role);
            // 공간 유저간 중간 테이블 등록
            await this.userMeetingService.createUserMeeting(queryRunner, id, meeting_id, meetingRole_id);

            await queryRunner.commitTransaction();
            return ;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    // 내가 속한 공간 정보 조회
    async getMyMeeting(user_id:number){
        const usermeeting: Array<UserMeetingEntity> = await this.userMeetingRepo.find({ where: { user_id: user_id , isDel:'N'}, relations: ['meeting','role'] });
        //console.log(usermeeting);
        let meetings = [];
        usermeeting.forEach((data) => {
            const object = Object.assign({
                meeting_id: data.meeting_id,
                meeting_name: data.meeting.meeting_name,
                meeting_logo_path: data.meeting.meeting_logo_path,
                owner_id: data.meeting.owner_id,
                join_code: data.role.role_type === 'Admin' ? data.meeting.admin_code : data.meeting.common_code,
                common_code: data.meeting.common_code,
                admin_code: data.role.role_type === 'Admin' ? data.meeting.admin_code : '',
                role_name: data.role.role_name,
                role_type: data.role.role_type
            });
            if (data.meeting.owner_id !== String(user_id)) {
                delete object.owner_id;
            }

            if (data.role.role_type === 'Common') {
                delete object.admin_code;
            }

            meetings.push(object);

        })
        
        return meetings;
    }

    // 참여 코드로 공간 참여하기
    // 참여 코드가 존재 하는지 체크 -> 참여코드의 권한 타입 체크 -> 참여 여부 체크 -> usermeeting에 등록
    async joinMeeting(userid: number, joinMeetingDto: JoinMeetingDto) {
        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();
        const joincode = joinMeetingDto.joincode;
        
        await queryRunner.startTransaction();
        try {
            const meetingByCode = await queryRunner.manager.findOne(MeetingEntity, { where: [{ admin_code: joincode, isDel: 'N'}, {common_code: joincode, isDel: 'N'}]});
            if(!meetingByCode){
                throw new NotFoundException('joincode is not exists');
            }
            
            const meeting_id = meetingByCode.id;
            const role_type = meetingByCode.admin_code === joincode ? 'Admin' : 'Common';
            // 사용자는 한 공간에 하나의 역할을 가짐.
            const meetingByuserId = await queryRunner.manager.findOne(UserMeetingEntity, { where: { meeting_id: meeting_id, user_id: userid, isDel: 'N'}});
            if(meetingByuserId){
                throw new ConflictException('Already join in this meeting.');
            }
            
            const meetingRole = await queryRunner.manager.findOne(MeetingRoleEntity, { where: { meeting_id: meeting_id, role_name: joinMeetingDto.role_name, role_type: role_type, isDel: 'N'}});
            if(!meetingRole){
                throw new NotFoundException('Role is not exists');
            }
            const meetingRole_id = meetingRole.id;
            // 현재 공간에 속해있지 않으면 
            // 공간 유저간 중간 테이블 등록
            await this.userMeetingService.createUserMeeting(queryRunner, userid, meeting_id, meetingRole_id);

            await queryRunner.commitTransaction();
            return ;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    // 참여코드의 정보 가져오기
    // 참여코드 존재 여부 체크 -> 참여코드 권한 타입 체크 -> 해당 참여코드의 공간, 권한 정보 추출 
    async getJoincodeInfo(userid: number, joincode: string) {

        const meetingByCode = await this.MeetingRepo.findOne({ where: [{ admin_code: joincode , isDel: 'N'}, {common_code: joincode, isDel: 'N'}]});

        if(!meetingByCode){
            throw new NotFoundException('joincode not exists');
        }
        
        const meeting_id = meetingByCode.id;
        const role_type = meetingByCode.admin_code === joincode ? 'Admin' : 'Common';

        const meetingRole = await this.meetingRoleRepo.find({ where : {meeting_id: meeting_id, role_type: role_type, isDel: 'N'}});
        //console.log(meetingRole)
        let roleNames = meetingRole.map(data => Object.assign({
            id: data.id,
            role_name: data.role_name
        }));
        
        return {
            meeting_id: meeting_id,
            meeting_name: meetingByCode.meeting_name,
            meeting_log_path: meetingByCode.meeting_logo_path,
            role_type: role_type,
            roles: roleNames
        };
        
    }

    // 공간 역할 soft delete(isDel update)
    async deleteRoleById(userid: number, deleteRoleDto: DeleteRoleDto){
        const meetingRoleById = await this.meetingRoleRepo.findOne({ where: { id: deleteRoleDto.role_id, isDel: 'N' }});

        if(!meetingRoleById){
            throw new NotFoundException('role is not exists');
        }

        const userMeeting = await this.userMeetingRepo.findOne({ where: { meeting_role_id: deleteRoleDto.role_id, isDel: 'N' }});

        if(userMeeting){
            throw new BadRequestException('role is in use.');
        }

        const userMeetingByids = await this.userMeetingRepo.findOne({ where: { meeting_role_id: deleteRoleDto.role_id,  isDel: 'N' }});

        await this.meetingRoleRepo.update({id: deleteRoleDto.role_id}, {isDel: 'Y'});
    }

    // 공간 soft delete(isDel update)
    async deleteMeetingById(userid: number, deleteMeetingDto: DeleteMeetingDto){
        const meetingById = await this.MeetingRepo.findOne({ where: { id: deleteMeetingDto.meeting_id, isDel: 'N'}});

        if(!meetingById){
            throw new NotFoundException('meeting is not exists');
        }

        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();
        
        await queryRunner.startTransaction();
        try {
            // 유저 공간(usermeeting) 삭제
            //await queryRunner.manager.delete(UserMeetingEntity, { meeting_id: meeting_id});
            await queryRunner.manager.update(UserMeetingEntity, { meeting_id: deleteMeetingDto.meeting_id}, {isDel: 'Y'});
            
            // 공간 역할(meetingrole) 삭제
            //await queryRunner.manager.delete(MeetingRoleEntity, { meeting_id: meeting_id});
            await queryRunner.manager.update(MeetingRoleEntity, { meeting_id: deleteMeetingDto.meeting_id}, {isDel: 'Y'});
            // 공간 (meeting) 삭제
            //await queryRunner.manager.delete(MeetingEntity, { id: meeting_id});
            await queryRunner.manager.update(MeetingEntity, { id: deleteMeetingDto.meeting_id}, {isDel: 'Y'});

            await queryRunner.commitTransaction();
            return ;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
}
