import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, QueryRunner, Repository } from 'typeorm';
import { SpaceEntity } from './space.entity';
import { CreateSpaceDto } from './dto/create-space.dto';
import { CreateSpaceParamDto } from './dto/create-param.dto';
import { UserSpaceService } from 'src/userspace/userspace.service';
import { SpaceRoleService } from 'src/spacerole/spacerole.service';
import { UserSpaceEntity } from 'src/userSpace/userspace.entity';
import { JoinSpaceDto } from './dto/join-space.dto';

@Injectable()
export class SpaceService {
    constructor(
        @InjectRepository(SpaceEntity) private readonly SpaceRepo: Repository<SpaceEntity>,
        @InjectRepository(UserSpaceEntity) private userSpaceRepository: Repository<UserSpaceEntity>,
        private readonly connection: Connection,
        private readonly userSpaceService: UserSpaceService,
        private readonly spaceRoleService: SpaceRoleService
    ){}
    
    createRandomCode(length: number) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i<length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        
        return result;
    }

    async checkCode(queryRunner: QueryRunner, createSpaceDto: CreateSpaceDto){
        let isUnique = false;
        let admin_code = '';
        let common_code = '';
        
        while(!isUnique) {
            const randomCode = this.createRandomCode(8);
            const adminCodeExist = await queryRunner.manager.findOne(SpaceEntity, {admin_code: randomCode});
            if(!adminCodeExist){
                isUnique = true;
                admin_code = randomCode;
            }
        }

        isUnique = false;
        while(!isUnique) {
            const randomCode = this.createRandomCode(8);
            const adminCodeExist = await queryRunner.manager.findOne(SpaceEntity, {common_code: randomCode});
            if(!adminCodeExist){
                isUnique = true;
                common_code = randomCode;
            }
        }

        createSpaceDto.admin_code = admin_code;
        createSpaceDto.common_code = common_code;
        return createSpaceDto;

    }
    // 공간 등록 API
    /*
        1. SPACE 테이블 등록작업
            1.1 관리자, 참여자 코드 난수 생성 및 중복 확인 로직
            1.2 공간 저장
        2. SPACEROLE 테이블 등록작업
            2.1 관리자명 목록, 참여자명 목록 별로 등록
        3. USERSPACE 테이블 등록작업
            3.1 공간 생성(owner)자 id, spacerole id, space id 등록
    */
    async createSpace(id: number, createSpaceParamDto: CreateSpaceParamDto) {
        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();

        await queryRunner.startTransaction();
        try {
            const { admin_array, common_array, owner_role, ...body} = createSpaceParamDto
            const createSpaceDto = new CreateSpaceDto();
            createSpaceDto.space_name = body.space_name;
            createSpaceDto.owner_id = String(id);
            createSpaceDto.space_logo_path = body.space_logo_path;
            // 관리자, 참여자 코드 생성 및 중복 검사
            await this.checkCode(queryRunner, createSpaceDto);
            // 공간 등록
            const space = await queryRunner.manager.save(SpaceEntity, createSpaceDto);
            // 공간역할 등록
            const space_id = space.id;
            const spaceRole_id = await this.spaceRoleService.createSpaceRole(queryRunner, space_id, admin_array, common_array, owner_role);
            // 공간 유저간 중간 테이블 등록
            await this.userSpaceService.createUserSpace(queryRunner, id, space_id, spaceRole_id);

            await queryRunner.commitTransaction();
            return ;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async getMySpace(user_id:number){
        const userspace: Array<UserSpaceEntity> = await this.userSpaceRepository.find({ where: { user_id: user_id }, relations: ['space','role'] });
        //console.log(userspace);
        let spaces = [];
        userspace.forEach((data) => {
            const object = Object.assign({
                space_name: data.space.space_name,
                space_logo_path: data.space.space_logo_path,
                owner_id: data.space.owner_id,
                join_code: data.role.role_type === 'Admin' ? data.space.admin_code : data.space.common_code,
                role_name: data.role.role_name
            });
            spaces.push(object);

        })
        
        return spaces;
    }

    async joinSapce(joinSpaceDto: JoinSpaceDto) {
        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();
        const joincode = joinSpaceDto.joincode;
        
        await queryRunner.startTransaction();
        try {
            const space = await queryRunner.manager.findOne(SpaceEntity, { where: [{ admin_code: joincode }, {common_code: joincode}]});
            if(!space){
                throw new NotFoundException('joincode not exists');
            }
            console.log(space);
            
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
