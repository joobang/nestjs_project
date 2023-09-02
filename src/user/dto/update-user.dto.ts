
import { IsEmail, IsOptional, IsString, Length, Matches } from 'class-validator';

export class UpdateUserDto {
    
    @IsOptional()
    @IsString()
    @Length(1, 30)
    firstname: string;

    @IsOptional()
    @IsString()
    @Length(1, 30)
    lastname: string;

    @IsOptional()
    @IsString()
    @Length(8, 50)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])((?=.*[!@#$%^&*()])|(?=.*\d))[A-Za-z\d!@#$%^&*()]{8,50}$/, {message: 'password too weak'})
    password: string;

    @IsOptional()
    @IsString()
    profile_path: string;
}
  