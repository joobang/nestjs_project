import { Controller, UseGuards, Get,Post, Req, Logger, Res, ValidationPipe, Body, UsePipes, Param } from '@nestjs/common';
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
        
        if (process.env.NODE_ENV === 'dev') {
            this.logger.log(`POST /post has been executed`);
        }
        await this.postServcie.createPost(req.user.id, createPostDto);
        return Object.assign({
            statusCode: 200,
            statusMsg: 'create post'
        })
    }

    @UseGuards(JwtServiceAuthGuard)
    @UsePipes(ValidationPipe)
    @Get(':id')
    async getPost(@Req() req, @Param('id') id: number){
        
        if (process.env.NODE_ENV === 'dev') {
            this.logger.log(`GET /post/:id has been executed`);
        }
        const data = await this.postServcie.getPostBySpaceId(req.user.id, id);
        return Object.assign({
            data: data,
            statusCode: 200,
            statusMsg: 'get posts by space id'
        })
    }
}
