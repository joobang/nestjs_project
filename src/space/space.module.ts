import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpaceEntity } from './space.entity';
import { SpaceController } from './space.controller';
import { SpaceService } from './space.service';
import { SpaceRoleModule } from 'src/spacerole/spacerole.module';
import { UserSpaceModule } from 'src/userspace/userspace.module';

@Module({
    imports: [TypeOrmModule.forFeature([SpaceEntity]), SpaceRoleModule, UserSpaceModule],
    controllers: [SpaceController],
    providers: [SpaceService],
    exports: [SpaceService]
})
export class SpaceModule {}
