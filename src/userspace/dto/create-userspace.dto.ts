
import { IsEmail, IsOptional, IsString, Length, Matches } from 'class-validator';

export class CreateUserSpaceDto {
    
    @IsString()
    @Length(1, 20)
    user_id: string;

    @IsString()
    @Length(1, 20)
    space_id: string;

    @IsString()
    @Length(1, 20)
    space_role_id: string;


}
  