import { MeetingEntity } from 'src/meeting/meeting.entity';
import { MeetingRoleEntity } from 'src/meetingerole/meetingrole.entity';
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
export class UserMeetingEntity {
  @PrimaryColumn()
  user_id: number;

  @PrimaryColumn()
  meeting_id: number;

  @Column({type: 'int'})
  meeting_role_id: number;
    
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

  @ManyToOne(()=> UserEntity, userEntity=> userEntity.userMeeting)
  @JoinColumn({ name: 'user_id',referencedColumnName: 'id' }) 
  user: UserEntity;

  @ManyToOne(()=> MeetingEntity, meetingEntity=> meetingEntity.userMeeting)
  @JoinColumn({ name: 'meeting_id', referencedColumnName: 'id' }) 
  meeting: MeetingEntity;

  @ManyToOne(()=> MeetingRoleEntity, meetingRoleEntity=> meetingRoleEntity.userMeeting)
  @JoinColumn({ name: 'meeting_role_id', referencedColumnName: 'id' }) 
  role: MeetingRoleEntity;

}
  