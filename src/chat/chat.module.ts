import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatEntity } from './chat.entity';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([ChatEntity]),
        
    ],
    controllers: [ChatController],
    providers: [ChatController],
    exports: [ChatService]
})
export class PostModule {}
