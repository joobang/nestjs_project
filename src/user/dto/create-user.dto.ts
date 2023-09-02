
import { IsEmail, IsOptional, IsString, Length, Matches } from 'class-validator';

export class CreateUserDto {
    
    @IsEmail()
    email: string;

    @IsString()
    @Length(1, 30)
    firstname: string;

    @IsString()
    @Length(1, 30)
    lastname: string;

    @IsString()
    @Length(8, 50)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])((?=.*[!@#$%^&*()])|(?=.*\d))[A-Za-z\d!@#$%^&*()]{8,50}$/, {message: 'password too weak'})
    password: string;

    @IsOptional()
    @IsString()
    profile_path: string;
}
  