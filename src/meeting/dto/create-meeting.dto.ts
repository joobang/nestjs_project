
import { ArrayNotEmpty, IsArray, IsEmail, IsOptional, IsString, Length, Matches } from 'class-validator';

export class CreateMeetingDto {
    
    @IsString()
    @Length(1, 100)
    meeting_name: string;

    @IsString()
    @Length(1, 20)
    owner_id: string;

    @IsString()
    @Length(1, 20)
    admin_code: string;

    @IsString()
    @Length(1, 20)
    common_code: string;

    @IsOptional()
    @IsString()
    meeting_logo_path: string;
}
  