
import { ArrayNotEmpty, IsArray, IsEmail, IsNumber, IsOptional, IsString, Length, Matches } from 'class-validator';

export class DeleteMeetingDto {
    
    @IsNumber()
    meeting_id: number
    
}
  