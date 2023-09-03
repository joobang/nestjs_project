import { UserSpaceEntity } from 'src/userSpace/userspace.entity';
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
  } from 'typeorm';

@Entity('SPACEROLE')
export class SpaceRoleEntity {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({type: 'varchar', length: 20, nullable: false })
  space_id: string;

  @Column({type: 'varchar', length: 50, nullable: false })
  role_name: string;

  @Column({type: 'varchar', length: 10, nullable: false })
  role_type: string;
    
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

  @OneToMany(()=> UserSpaceEntity, userSpaceEntity => userSpaceEntity.user)
  userSpace: UserSpaceEntity[];

}
  