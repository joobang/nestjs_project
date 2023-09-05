
import { ArrayNotEmpty, IsArray, IsEmail, IsOptional, IsString, Length, Matches } from 'class-validator';
import { IsInArray } from 'src/utils/vaildate/is-in-array';

export class CreateMeetingParamDto {
    
    @IsString()
    @Length(1, 100)
    meeting_name: string;

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
    meeting_logo_path: string;
}
  