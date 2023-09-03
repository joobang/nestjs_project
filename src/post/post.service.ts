import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { PostEntity } from './post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UserSpaceService } from 'src/userspace/userspace.service';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(PostEntity)
        private readonly PostRepo: Repository<PostEntity>,
        private readonly userSpaceService: UserSpaceService,
        
    ){}

    async createPost(user_id: number, createPostDto: CreatePostDto){
        const space_id = createPostDto.space_id;
        const userspace = await this.userSpaceService.getUserSpace(user_id, space_id)
        
        await this.PostRepo.save({user_id: user_id,...createPostDto});
    }
}
