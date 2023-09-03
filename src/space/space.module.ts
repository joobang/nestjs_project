import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpaceEntity } from './space.entity';
import { SpaceController } from './space.controller';
import { SpaceService } from './space.service';
import { UserSpaceModule } from 'src/userspace/userspace.module';
import { SpaceRoleModule } from 'src/spacerole/spacerole.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([SpaceEntity]),
        UserSpaceModule,
        SpaceRoleModule
    ],
    controllers: [SpaceController],
    providers: [SpaceService],
    exports: [SpaceService]
})
export class SpaceModule {}
