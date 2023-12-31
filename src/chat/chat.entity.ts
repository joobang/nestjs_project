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

@Entity('CHAT')
export class ChatEntity {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({type: 'varchar', length: 20, nullable: false })
  user_id: string;
  
  @Column({type: 'int', nullable: false })
  post_id: number;
  
  @Column({type: 'varchar', length: 20, nullable: false})
  chat_id: string;
  
  @Column({type: 'text', nullable: false})
  content: string;

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


}
  