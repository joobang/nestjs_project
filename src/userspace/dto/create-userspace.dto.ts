
import { IsEmail, IsNumber, IsOptional, IsString, Length, Matches } from 'class-validator';

export class CreateUserSpaceDto {
    
    @IsNumber()
    user_id: number;

    @IsNumber()
    space_id: number;

    @IsNumber()
    space_role_id: number;


}
  