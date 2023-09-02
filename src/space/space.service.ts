import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { SpaceEntity } from './space.entity';
import { SpaceroleService } from '../spaceRole/spaceRole.service';
import { UserspaceService } from '../userSpace/userSpace.service';

@Injectable()
export class SpaceService {
    constructor(
        @InjectRepository(SpaceEntity)
        private readonly SpaceRepo: Repository<SpaceEntity>,
        private readonly connection: Connection,
        private readonly spaceRoleService: SpaceroleService,
        private readonly userSpaceService: UserspaceService,
    ){}
}
