import { IsIn } from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column,
         CreateDateColumn, UpdateDateColumn} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'email'})
  provider: string;

  @Column({nullable: true})
  providerId: string;

  @Column({ unique: true })
  email:string;

  @Column({ default: false})
  emailConfirmed: boolean;

  @Column()
  name: string;

  @Column({nullable: true})
  password: string;

  @Column({default: false})
  admin: boolean;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
