import { UserEntity } from 'src/user/user.entity';
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
  } from 'typeorm';

@Entity('USERSPACE')
export class UserSpaceEntity {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({type: 'varchar', length: 20, nullable: false })
  user_id: string;

  @Column({type: 'varchar', length: 20, nullable: false })
  space_id: string;

  @Column({type: 'varchar', length: 20, nullable: false })
  space_role_id: string;
    
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

  @ManyToOne(()=> UserEntity, userEntity=> userEntity.userSpace)
  user: UserEntity;

}
  