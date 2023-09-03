import { Injectable } from '@nestjs/common';
import { UserSpaceEntity } from './userspace.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';

@Injectable()
export class UserSpaceService {
    constructor(
        @InjectRepository(UserSpaceEntity)
        private readonly UserSpaceRepo: Repository<UserSpaceEntity>
    ){}

    async createUserSpace(queryRunner: QueryRunner, space_id: number, role_id: number) {
        return;
    }
}
