
import { IsEmail, IsOptional, IsString, Length, Matches } from 'class-validator';

export class CreateMeetingRoleDto {
    
    @IsString()
    @Length(1, 20)
    meeting_id: string;

    @IsString()
    @Length(1, 50)
    role_name: string;

    @IsString()
    @Length(1, 10)
    role_type: string;

}
  