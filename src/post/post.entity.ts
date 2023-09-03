import { SpaceEntity } from 'src/space/space.entity';
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';

@Entity('POST')
export class PostEntity {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({type: 'int', nullable: false })
  user_id: number;
  
  @Column({type: 'int', nullable: false })
  space_id: number;
  
  @Column({type: 'varchar', length: 255, nullable: false})
  title: string;
  
  @Column({type: 'text', nullable: false})
  content: string;

  @Column({type: 'varchar', length: 20, nullable: false })
  post_type: string;

  @Column({type: 'varchar', length: 5, nullable: false })
  isAno: string;
  
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

  @ManyToOne(()=> SpaceEntity, spaceEntity=> spaceEntity.post)
  @JoinColumn({ name: 'space_id', referencedColumnName: 'id' }) 
  space: SpaceEntity;

}
  