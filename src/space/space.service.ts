import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, QueryRunner, Repository } from 'typeorm';
import { SpaceEntity } from './space.entity';
import { CreateSpaceDto } from './dto/create-space.dto';
import { CreateSpaceParamDto } from './dto/create-param.dto';
import { UserSpaceService } from 'src/userspace/userspace.service';
import { SpaceRoleService } from 'src/spacerole/spacerole.service';
import { UserSpaceEntity } from 'src/userSpace/userspace.entity';
import { JoinSpaceDto } from './dto/join-space.dto';
import { SpaceRoleEntity } from 'src/spacerole/spacerole.entity';

@Injectable()
export class SpaceService {
    constructor(
        @InjectRepository(SpaceEntity) private readonly SpaceRepo: Repository<SpaceEntity>,
        @InjectRepository(UserSpaceEntity) private userSpaceRepo: Repository<UserSpaceEntity>,
        @InjectRepository(SpaceRoleEntity) private spaceRoleRepo: Repository<SpaceRoleEntity>,
        
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
            const adminCodeExist = await queryRunner.manager.findOne(SpaceEntity, {where: [{common_code: randomCode},{admin_code: randomCode}]});
            if(!adminCodeExist){
                isUnique = true;
                admin_code = randomCode;
            }
        }

        isUnique = false;
        while(!isUnique) {
            const randomCode = this.createRandomCode(8);
            const adminCodeExist = await queryRunner.manager.findOne(SpaceEntity, {where: [{common_code: randomCode},{admin_code: randomCode}]});
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
            const spaceRole_id = await this.spaceRoleService.createSpaceRoleBySpace(queryRunner, space_id, admin_array, common_array, owner_role);
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
        const userspace: Array<UserSpaceEntity> = await this.userSpaceRepo.find({ where: { user_id: user_id }, relations: ['space','role'] });
        //console.log(userspace);
        let spaces = [];
        userspace.forEach((data) => {
            const object = Object.assign({
                space_id: data.space_id,
                space_name: data.space.space_name,
                space_logo_path: data.space.space_logo_path,
                owner_id: data.space.owner_id,
                join_code: data.role.role_type === 'Admin' ? data.space.admin_code : data.space.common_code,
                role_name: data.role.role_name,
                role_type: data.role.role_type
            });
            if (data.space.owner_id !== String(user_id)) {
                delete object.owner_id;
            }

            spaces.push(object);

        })
        
        return spaces;
    }

    async joinSpace(userid: number, joinSpaceDto: JoinSpaceDto) {
        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();
        const joincode = joinSpaceDto.joincode;
        
        await queryRunner.startTransaction();
        try {
            const spaceByCode = await queryRunner.manager.findOne(SpaceEntity, { where: [{ admin_code: joincode }, {common_code: joincode}]});
            if(!spaceByCode){
                throw new NotFoundException('joincode is not exists');
            }
            
            const space_id = spaceByCode.id;
            const role_type = spaceByCode.admin_code === joincode ? 'Admin' : 'Common';
            // 사용자는 한 공간에 하나의 역할을 가짐.
            const spaceByuserId = await queryRunner.manager.findOne(UserSpaceEntity, { where: { space_id: space_id, user_id: userid }});
            if(spaceByuserId){
                throw new ConflictException('Already join in this space.');
            }
            
            const spaceRole = await queryRunner.manager.findOne(SpaceRoleEntity, { where: { space_id: space_id, role_name: joinSpaceDto.role_name, role_type: role_type}});
            if(!spaceRole){
                throw new NotFoundException('Role is not exists');
            }
            const spaceRole_id = spaceRole.id;
            // 현재 공간에 속해있지 않으면 
            // 공간 유저간 중간 테이블 등록
            await this.userSpaceService.createUserSpace(queryRunner, userid, space_id, spaceRole_id);

            await queryRunner.commitTransaction();
            return ;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async getJoincodeInfo(userid: number, joincode: string) {

        const spaceByCode = await this.SpaceRepo.findOne({ where: [{ admin_code: joincode }, {common_code: joincode}]});

        if(!spaceByCode){
            throw new NotFoundException('joincode not exists');
        }
        
        const space_id = spaceByCode.id;
        const role_type = spaceByCode.admin_code === joincode ? 'Admin' : 'Common';

        const spaceRole = await this.spaceRoleRepo.find({ where : {space_id: space_id, role_type: role_type}});
        
        let roleNames = spaceRole.map(data => data.role_name);
        
        return {
            space_id: space_id,
            space_name: spaceByCode.space_name,
            space_log_path: spaceByCode.space_logo_path,
            role_type: role_type,
            role_names: roleNames
        };
        
    }

    async deleteRoleById(role_id: number){
        const spaceRoleById = await this.spaceRoleRepo.findOne({ where: { id: role_id }});

        if(!spaceRoleById){
            throw new NotFoundException('role is not exists');
        }

        const userSpace = await this.userSpaceRepo.findOne({ where: { space_role_id: role_id }});

        if(userSpace){
            throw new BadRequestException('role is in use.');
        }
        await this.spaceRoleRepo.update({id: role_id}, {isDel: 'Y'});
    }

    async deleteSpaceById(space_id: number){
        const spaceById = await this.SpaceRepo.findOne({ where: { id: space_id }});

        if(!spaceById){
            throw new NotFoundException('space is not exists');
        }

        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();
        
        await queryRunner.startTransaction();
        try {
            // 유저 공간(userspace) 삭제
            //await queryRunner.manager.delete(UserSpaceEntity, { space_id: space_id});
            await queryRunner.manager.update(UserSpaceEntity, { space_id: space_id}, {isDel: 'Y'});
            
            // 공간 역할(spacerole) 삭제
            //await queryRunner.manager.delete(SpaceRoleEntity, { space_id: space_id});
            await queryRunner.manager.update(SpaceRoleEntity, { space_id: space_id}, {isDel: 'Y'});
            // 공간 (space) 삭제
            //await queryRunner.manager.delete(SpaceEntity, { id: space_id});
            await queryRunner.manager.update(SpaceEntity, { id: space_id}, {isDel: 'Y'});

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
