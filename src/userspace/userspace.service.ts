import { Injectable } from '@nestjs/common';
import { UserSpaceEntity } from './userspace.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { CreateUserSpaceDto } from './dto/create-userspace.dto';

@Injectable()
export class UserSpaceService {
    constructor(
        @InjectRepository(UserSpaceEntity)
        private readonly UserSpaceRepo: Repository<UserSpaceEntity>
    ){}

    async createUserSpace(queryRunner: QueryRunner, user_id: number, space_id: number, role_id: number) {
        const createUserSpaceDto = new CreateUserSpaceDto();
        createUserSpaceDto.user_id = String(user_id);
        createUserSpaceDto.space_id = String(space_id);
        createUserSpaceDto.space_role_id = String(role_id);
        
        await queryRunner.manager.save(UserSpaceEntity, createUserSpaceDto);
        
        return;
    }
}
