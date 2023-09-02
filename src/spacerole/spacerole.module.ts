import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpaceRoleEntity } from './spacerole.entity';
import { SpaceroleService } from './spacerole.service';

@Module({
    imports: [TypeOrmModule.forFeature([SpaceRoleEntity])],
    providers: [SpaceroleService],
    exports: [SpaceroleService]
})
export class SpaceroleModule {}
