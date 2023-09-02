
import { IsEmail, IsOptional, IsString, Length, Matches } from 'class-validator';

export class CreateSpaceDto {
    
    @IsString()
    @Length(1, 100)
    space_name: string;

    @IsString()
    @Length(1, 20)
    owner_id: string;

    @IsString()
    @Length(1, 20)
    admin_code: string;

    @IsString()
    @Length(1, 20)
    common_code: string;

    @IsOptional()
    @IsString()
    space_logo_path: string;
}
  