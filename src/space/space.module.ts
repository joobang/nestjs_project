import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpaceEntity } from './space.entity';
import { SpaceController } from './space.controller';
import { SpaceService } from './space.service';
import { SpaceroleModule } from 'src/spacerole/spacerole.module';
import { UserspaceModule } from 'src/userspace/userspace.module';

@Module({
    imports: [TypeOrmModule.forFeature([SpaceEntity]), SpaceroleModule, UserspaceModule],
    controllers: [SpaceController],
    providers: [SpaceService],
    exports: [SpaceService]
})
export class SpaceModule {}
