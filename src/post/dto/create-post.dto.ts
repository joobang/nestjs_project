
import { ArrayNotEmpty, IsArray, IsEmail, IsNumber, IsOptional, IsString, Length, Matches } from 'class-validator';

export class CreatePostDto {
  
    @IsNumber()
    meeting_id: number;

    @IsString()
    @Length(1, 255)
    title: string;

    @IsString()
    content: string;

    @IsString()
    @Length(1, 20)
    post_type: string;

    @IsString()
    @Length(1, 5)
    isAno: string;

    @IsArray()
    file_path: Array<string>;

    @IsArray()
    image_path: Array<string>;
}
  