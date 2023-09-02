import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';

@Entity('SPACE')
export class SpaceEntity {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({type: 'varchar', length: 100, nullable: false })
  space_name: string;

  @Column({type: 'varchar', length: 255, nullable: true })
  space_logo_path: string;
  
  @Column({type: 'varchar', length: 20, nullable: false })
  owner_id: string;
  
  @Column({type: 'varchar', length: 20, nullable: false, unique: true })
  admin_code: string;
  
  @Column({type: 'varchar', length: 20, nullable: false, unique: true })
  common_code: string;
  
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
  