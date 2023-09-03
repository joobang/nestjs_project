
import { IsEmail, IsOptional, IsString, Length, Matches } from 'class-validator';

export class CreateSpaceRoleDto {
    
    @IsString()
    @Length(1, 20)
    space_id: string;

    @IsString()
    @Length(1, 50)
    role_name: string;

    @IsString()
    @Length(1, 10)
    role_type: string;

}
  