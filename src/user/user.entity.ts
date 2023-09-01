import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
  @Entity()
  export class User {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ unique: true })
    email: string;

    @Column()
    firstname: string;

    @Column()
    lastname: string;
  
    @Column()
    password: string;
  
    @Column({ nullable: true })
    profile_path: string;
  
    @Column()
    isDel: string;

    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;
  
  }
  