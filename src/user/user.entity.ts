import { UserSpaceEntity } from 'src/userSpace/userspace.entity';
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
  } from 'typeorm';

@Entity('USERS')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({type: 'varchar', length: 50, unique: true, nullable: false })
  email: string;
  
  @Column({type: 'varchar', length: 30, nullable: false})
  firstname: string;

  @Column({type: 'varchar', length: 30, nullable: false})
  lastname: string;

  @Column({type: 'varchar', length: 255, nullable: false})
  password: string;
  
  @Column({type: 'varchar', length: 255, nullable: true })
  profile_path: string;

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

  @OneToMany(()=> UserSpaceEntity, userSpace => userSpace.user)
  userSpace: UserSpaceEntity[];

}
  