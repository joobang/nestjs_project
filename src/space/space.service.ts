import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, QueryRunner, Repository } from 'typeorm';
import { SpaceEntity } from './space.entity';
import { CreateSpaceDto } from './dto/create-space.dto';
import { CreateSpaceParamDto } from './dto/create-param.dto';
import { UserSpaceService } from 'src/userspace/userspace.service';
import { SpaceRoleService } from 'src/spacerole/spacerole.service';

@Injectable()
export class SpaceService {
    constructor(
        @InjectRepository(SpaceEntity) private readonly SpaceRepo: Repository<SpaceEntity>,
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
            
            await this.checkCode(queryRunner, createSpaceDto);
            //console.log(createSpaceDto);
            const space = await queryRunner.manager.save(SpaceEntity, createSpaceDto);
            
            const space_id = space.id;
            await this.spaceRoleService.createSpaceRole(queryRunner, space_id, admin_array, common_array);

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
