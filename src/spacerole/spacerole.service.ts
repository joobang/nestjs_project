import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SpaceRoleEntity } from './spacerole.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SpaceRoleService {
    constructor(
        @InjectRepository(SpaceRoleEntity)
        private readonly SpaceRoleRepo: Repository<SpaceRoleEntity>,
    ){}

}
