import { Controller, UseGuards, Get,Post, Req, Logger, Res } from '@nestjs/common';
import { ChatService } from './chat.service';


@Controller('chat')
export class ChatController {
    private readonly logger = new Logger(ChatController.name);
    constructor(private readonly chatService: ChatService){}

}
