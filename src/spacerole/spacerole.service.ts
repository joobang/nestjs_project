import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SpaceRoleEntity } from './spacerole.entity';

@Injectable()
export class SpaceRoleService {
    constructor(
        @InjectRepository(SpaceRoleEntity)
        private readonly SpaceRoleRepo: Repository<SpaceRoleEntity>
    ){}
}
