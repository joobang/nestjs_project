import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
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

    async createSpace(id: number, createSpaceParamDto: CreateSpaceParamDto) {
        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();

        await queryRunner.startTransaction();
        try {
            const { admin_array, common_array, owner_role, ...body} = createSpaceParamDto
            const createSpaceDto = new CreateSpaceDto();
            createSpaceDto.space_name = body.space_name;
            createSpaceDto.owner_id = String(id);
            createSpaceDto.admin_code = body.admin_code;
            createSpaceDto.common_code = body.common_code;
            createSpaceDto.space_logo_path = body.space_logo_path;
            
            const space = await queryRunner.manager.save(SpaceEntity, createSpaceDto);
            
            const space_id = space.id;
            // await this.spaceRoleService.createSpaceRole(queryRunner, space_id, admin_array, common_array);

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
