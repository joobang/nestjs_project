
import { ArrayNotEmpty, IsArray, IsEmail, IsNumber, IsOptional, IsString, Length, Matches } from 'class-validator';

export class DeleteRoleDto {
    
    @IsNumber()
    space_id: number

    @IsNumber()
    role_id: number
    
}
  