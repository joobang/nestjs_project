
import { ArrayNotEmpty, IsArray, IsEmail, IsOptional, IsString, Length, Matches } from 'class-validator';

export class JoinMeetingDto {
    
    @IsString()
    @Length(1, 8)
    joincode: string;

    @IsString()
    @Length(1, 50)
    role_name: string;

}
  