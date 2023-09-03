import { SpaceEntity } from 'src/space/space.entity';
import { SpaceRoleEntity } from 'src/spacerole/spacerole.entity';
import { UserEntity } from 'src/user/user.entity';
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    PrimaryColumn,
  } from 'typeorm';

@Entity({name: 'USERSPACE'})
export class UserSpaceEntity {
  @PrimaryColumn()
  user_id: number;

  @PrimaryColumn()
  space_id: number;

  @Column({type: 'int'})
  space_role_id: number;
    
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
  @JoinColumn({ name: 'user_id',referencedColumnName: 'id' }) 
  user: UserEntity;

  @ManyToOne(()=> SpaceEntity, spaceEntity=> spaceEntity.userSpace)
  @JoinColumn({ name: 'space_id', referencedColumnName: 'id' }) 
  space: SpaceEntity;

  @ManyToOne(()=> SpaceRoleEntity, spaceRoleEntity=> spaceRoleEntity.userSpace)
  @JoinColumn({ name: 'space_role_id', referencedColumnName: 'id' }) 
  role: SpaceRoleEntity;

}
  