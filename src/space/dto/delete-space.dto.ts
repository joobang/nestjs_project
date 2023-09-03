
import { ArrayNotEmpty, IsArray, IsEmail, IsNumber, IsOptional, IsString, Length, Matches } from 'class-validator';

export class DeleteSpaceDto {
    
    @IsNumber()
    space_id: number
    
}
  