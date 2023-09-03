import { Controller, UseGuards, Get,Post, Req, Logger, Res, ValidationPipe, Body, UsePipes } from '@nestjs/common';
import { PostService } from './post.service';
import { JwtServiceAuthGuard } from 'src/auth/guards/jwt-service.guard';
import { CreatePostDto } from './dto/create-post.dto';

@Controller('post')
export class PostController {
    private readonly logger = new Logger(PostController.name);
    constructor(private readonly postServcie: PostService){}

    @UseGuards(JwtServiceAuthGuard)
    @UsePipes(ValidationPipe)
    @Post()
    async createSpace(@Req() req, @Body() createPostDto: CreatePostDto){
        this.logger.log(`POST /space has been executed`);
        await this.postServcie.createPost(req.user.id, createPostDto);
        return Object.assign({
            statusCode: 200,
            statusMsg: 'create space'
        })
    }
}
