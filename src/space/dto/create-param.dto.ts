
import { ArrayNotEmpty, IsArray, IsEmail, IsOptional, IsString, Length, Matches } from 'class-validator';
import { IsInArray } from 'src/utils/vaildate/is-in-array';

export class CreateSpaceParamDto {
    
    @IsString()
    @Length(1, 100)
    space_name: string;

    @IsString()
    @Length(1, 20)
    admin_code: string;

    @IsString()
    @Length(1, 20)
    common_code: string;

    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    admin_array: Array<string>;
    
    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    common_array: Array<string>;

    @IsString()
    @Length(1, 20)
    @IsInArray({ message: 'owner role must belong to admin_array.'})
    owner_role: string;

    @IsOptional()
    @IsString()
    space_logo_path: string;
}
  