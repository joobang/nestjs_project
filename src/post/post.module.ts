import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSpaceModule } from 'src/userspace/userspace.module';
import { SpaceRoleModule } from 'src/spacerole/spacerole.module';
import { UserSpaceEntity } from 'src/userSpace/userspace.entity';
import { SpaceRoleEntity } from 'src/spacerole/spacerole.entity';
import { PostEntity } from './post.entity';
import { SpaceEntity } from 'src/space/space.entity';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { SpaceModule } from 'src/space/space.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([PostEntity]),
        
    ],
    controllers: [PostController],
    providers: [PostService],
    exports: [PostService]
})
export class PostModule {}
