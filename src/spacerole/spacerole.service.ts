import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { SpaceRoleEntity } from './spacerole.entity';
import { CreateSpaceRoleDto } from './dto/create-spacerole.dto';

@Injectable()
export class SpaceRoleService {
    constructor(
        @InjectRepository(SpaceRoleEntity)
        private readonly SpaceRoleRepo: Repository<SpaceRoleEntity>
    ){}

    async createSpaceRoleBySpace(queryRunner: QueryRunner, space_id: number, admin_array: Array<string>, common_array: Array<string>, owner_role :string){
        let spaceRoleid = 0;
        for(let i = 0; i<admin_array.length; i++){
            const createSpaceRoleDto = new CreateSpaceRoleDto();
            createSpaceRoleDto.space_id = String(space_id);
            createSpaceRoleDto.role_name = admin_array[i];
            createSpaceRoleDto.role_type = 'Admin'
            
            const spaceRole = await queryRunner.manager.save(SpaceRoleEntity, createSpaceRoleDto);
            if(admin_array[i] === owner_role){
                spaceRoleid = spaceRole.id;
            }
        }

        for(let i = 0; i<common_array.length; i++){
            const createSpaceRoleDto = new CreateSpaceRoleDto();
            createSpaceRoleDto.space_id = String(space_id);
            createSpaceRoleDto.role_name = common_array[i];
            createSpaceRoleDto.role_type = 'Common'
            
            const spaceRole = await queryRunner.manager.save(SpaceRoleEntity, createSpaceRoleDto);
        }

        return spaceRoleid;
    }

    async createSpaceRoleByJoin(queryRunner: QueryRunner, space_id: number){
        let spaceRole_id = 0;
        const createSpaceRoleDto = new CreateSpaceRoleDto();
        //createSpaceRoleDto.space_id = String(space_id);
        // createSpaceRoleDto.role_name = admin_array[i];
        // createSpaceRoleDto.role_type = 'Admin'
        
        return spaceRole_id;
    }
    
}
