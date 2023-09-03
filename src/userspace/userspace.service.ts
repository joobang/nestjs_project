import { Injectable, NotFoundException } from '@nestjs/common';
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
        createUserSpaceDto.user_id = user_id;
        createUserSpaceDto.space_id = space_id;
        createUserSpaceDto.space_role_id = role_id;
        
        await queryRunner.manager.save(UserSpaceEntity, createUserSpaceDto);
        
        return;
    }

    async getUserSpace(user_id: number, space_id: number){
        const userSpace = await this.UserSpaceRepo.findOne({where:{user_id:user_id, space_id: space_id, isDel:'N'},relations:['role']})
        //console.log(userSpace);
        if(!userSpace){
            throw new NotFoundException('You are not join in this space.')
        }
        return userSpace;
    }
}
