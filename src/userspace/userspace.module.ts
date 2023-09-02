import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSpaceEntity } from './userspace.entity';
import { UserSpaceService } from './userspace.service';

@Module({
    imports: [TypeOrmModule.forFeature([UserSpaceEntity])],
    providers: [UserSpaceService],
    exports: [UserSpaceService]
})
export class UserSpaceModule {}
