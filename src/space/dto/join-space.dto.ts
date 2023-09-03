
import { ArrayNotEmpty, IsArray, IsEmail, IsOptional, IsString, Length, Matches } from 'class-validator';

export class JoinSpaceDto {
    
    @IsString()
    @Length(1, 8)
    joincode: string;
}
  