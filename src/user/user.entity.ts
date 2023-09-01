import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';

import { IsEmail, IsOptional, IsString, Length, Matches } from 'class-validator';
  
  @Entity('USERS')
  export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;
    
    @IsEmail()
    @Column({type: 'varchar', length: 50, unique: true, nullable: false })
    email: string;

    @IsString()
    @Length(1, 30)
    @Column({type: 'varchar', length: 30, nullable: false})
    firstname: string;

    @IsString()
    @Length(1, 30)
    @Column({type: 'varchar', length: 30, nullable: false})
    lastname: string;
  
    @IsString()
    @Length(8, 50)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])((?=.*[!@#$%^&*()])|(?=.*\d))[A-Za-z\d!@#$%^&*()]{8,50}$/, {message: 'password too weak'})
    @Column({type: 'varchar', length: 255, nullable: false})
    password: string;
    
    @IsOptional()
    @IsString()
    @Column({type: 'varchar', length: 100, nullable: true })
    profile_path: string;
  
    @IsOptional()
    @IsString()
    @Column({type: 'varchar', length: 5, default: 'N' })
    isDel: string;

    @CreateDateColumn({ type: 'timestamp', precision: 0,default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
  
    @UpdateDateColumn({
        type: 'timestamp',
        precision: 0,
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
    })
    updated_at: Date;
  
  }
  