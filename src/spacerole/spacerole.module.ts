import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpaceRoleEntity } from './spacerole.entity';
import { SpaceRoleService } from './spacerole.service';
import { UserSpaceEntity } from 'src/userSpace/userspace.entity';

@Module({
    imports: [TypeOrmModule.forFeature([SpaceRoleEntity, UserSpaceEntity])],
    providers: [SpaceRoleService],
    exports: [SpaceRoleService]
})
export class SpaceRoleModule {}
