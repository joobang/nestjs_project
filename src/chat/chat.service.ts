import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { ChatEntity } from './chat.entity';


@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(ChatEntity)
        private readonly ChatRepo: Repository<ChatEntity>
    ){}
}
