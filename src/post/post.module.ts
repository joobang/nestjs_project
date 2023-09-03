import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './post.entity';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { ChatEntity } from 'src/chat/chat.entity';
import { UserSpaceModule } from 'src/userspace/userspace.module';
@Module({
    imports: [
        TypeOrmModule.forFeature([PostEntity, ChatEntity]),
        UserSpaceModule
    ],
    controllers: [PostController],
    providers: [PostService],
    exports: [PostService]
})
export class PostModule {}
