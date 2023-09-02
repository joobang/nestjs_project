import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpaceEntity } from './space.entity';
import { SpaceController } from './space.controller';
import { SpaceService } from './space.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([SpaceEntity])
    ],
    controllers: [SpaceController],
    providers: [SpaceService],
    exports: [SpaceService]
})
export class SpaceModule {}
