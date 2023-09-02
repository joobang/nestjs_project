import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSpaceEntity } from './userspace.entity';
import { UserspaceService } from './userspace.service';

@Module({
    imports: [TypeOrmModule.forFeature([UserSpaceEntity])],
    providers: [UserspaceService],
    exports: [UserspaceService]
})
export class UserspaceModule {}
