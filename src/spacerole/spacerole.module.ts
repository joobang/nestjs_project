import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpaceRoleEntity } from './spacerole.entity';
import { SpaceRoleService } from './spacerole.service';

@Module({
    imports: [TypeOrmModule.forFeature([SpaceRoleEntity])],
    providers: [SpaceRoleService],
    exports: [SpaceRoleService]
})
export class SpaceRoleModule {}
