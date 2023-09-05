import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { PostEntity } from './post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UserMeetingService } from 'src/usermeeting/usermeeting.service';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(PostEntity)
        private readonly PostRepo: Repository<PostEntity>,
        private readonly userMeetingService: UserMeetingService,
        
    ){}

    async createPost(user_id: number, createPostDto: CreatePostDto){
        const meeting_id = createPostDto.meeting_id;
        const usermeeting = await this.userMeetingService.getUserMeeting(user_id, meeting_id)
        //console.log(usermeeting);
        // 참여자 인데 공지인 경우
        if((createPostDto.post_type === 'Notice') && (usermeeting.role.role_type === 'Common')){
            throw new BadRequestException('Common user cannot create Notice.');
        }

        if((createPostDto.isAno === 'Y') && (createPostDto.post_type === 'Notice')){
            throw new BadRequestException('Notices cannot be posted anonymously.');
        }

        if((createPostDto.isAno === 'Y') && (usermeeting.role.role_type === 'Admin')){
            throw new BadRequestException('Admin cannot post anonymously.');
        }

        const filepath = JSON.stringify(createPostDto.file_path);
        const imagepath = JSON.stringify(createPostDto.image_path);
        await this.PostRepo.save({
            user_id: user_id,
            meeting_id: createPostDto.meeting_id,
            title: createPostDto.title,
            content: createPostDto.content,
            post_type: createPostDto.post_type,
            isAno: createPostDto.isAno,
            file_path: filepath,
            image_path: imagepath
        });
    }

    async getPostByMeetingId(user_id: number, meeting_id: number){
        const usermeeting = await this.userMeetingService.getUserMeeting(user_id, meeting_id);
        const post = await this.PostRepo.find({where: {meeting_id: meeting_id}});
        //console.log(post);
        let parsePost = {};
        if(usermeeting.role.role_type === 'Common'){
            parsePost = post.map(item => {
                return {
                    ...item,
                    user_id: (user_id === item.user_id) || (item.isAno === 'N') ? item.user_id : '',
                    file_path: JSON.parse(item.file_path),
                    image_path: JSON.parse(item.image_path),                    
                }
            })
        }else if(usermeeting.role.role_type === 'Admin'){
            parsePost = post.map(item => {
                return {
                    ...item,
                    file_path: JSON.parse(item.file_path),
                    image_path: JSON.parse(item.image_path),                    
                }
            })
        }
        
        return parsePost;
    }
}
