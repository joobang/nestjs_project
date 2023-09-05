
import { IsEmail, IsNumber, IsOptional, IsString, Length, Matches } from 'class-validator';

export class CreateUserMeetingDto {
    
    @IsNumber()
    user_id: number;

    @IsNumber()
    meeting_id: number;

    @IsNumber()
    meeting_role_id: number;


}
  