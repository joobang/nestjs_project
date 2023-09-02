import { Injectable } from '@nestjs/common';
import { UserSpaceEntity } from './userspace.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserSpaceService {
    constructor(
        @InjectRepository(UserSpaceEntity)
        private readonly UserSpaceRepo: Repository<UserSpaceEntity>
    ){}
}
