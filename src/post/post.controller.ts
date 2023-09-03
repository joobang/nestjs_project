import { Controller, UseGuards, Get,Post, Req, Logger, Res } from '@nestjs/common';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
    private readonly logger = new Logger(PostController.name);
    constructor(private readonly postServcie: PostService){}

}
