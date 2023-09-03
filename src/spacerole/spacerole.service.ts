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

    async createSpaceRole(queryRunner: QueryRunner, space_id: number, admin_array: Array<string>, common_array: Array<string>){
        
        for(let i = 0; i<admin_array.length; i++){
            const createSpaceRoleDto = new CreateSpaceRoleDto();
            createSpaceRoleDto.space_id = String(space_id);
            createSpaceRoleDto.role_name = admin_array[i];
            createSpaceRoleDto.role_type = 'Admin'
            
            await queryRunner.manager.save(SpaceRoleEntity, createSpaceRoleDto);
        }

        return;
    }
    
}
