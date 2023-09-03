import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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
        console.log(userspace);
        // 참여자 인데 공지인 경우
        if((createPostDto.post_type === 'Notice') && (userspace.role.role_type === 'Common')){
            throw new BadRequestException('Common user cannot create Notice.');
        }

        if((createPostDto.isAno === 'Y') && (createPostDto.post_type === 'Notice')){
            throw new BadRequestException('Notices cannot be posted anonymously.');
        }

        if((createPostDto.isAno === 'Y') && (userspace.role.role_type === 'Admin')){
            throw new BadRequestException('Admin cannot post anonymously.');
        }

        const filepath = JSON.stringify(createPostDto.file_path);
        const imagepath = JSON.stringify(createPostDto.image_path);
        await this.PostRepo.save({
            user_id: user_id,
            space_id: createPostDto.space_id,
            title: createPostDto.title,
            content: createPostDto.content,
            post_type: createPostDto.post_type,
            isAno: createPostDto.isAno,
            file_path: filepath,
            image_path: imagepath
        });
    }

    async getPostBySpaceId(user_id: number, space_id: number){
        const userspace = await this.userSpaceService.getUserSpace(user_id, space_id);
        const post = await this.PostRepo.find({where: {space_id: space_id}});
        const parsePost = post.map(item => {
            return {
                ...item,
                file_path: JSON.parse(item.file_path),
                image_path: JSON.parse(item.image_path),                    
            }
        })
        return parsePost;
    }
}
