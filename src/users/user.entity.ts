import { Entity, PrimaryGeneratedColumn, Column,
         CreateDateColumn, UpdateDateColumn, Unique} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email:string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column({default: false})
  admin: boolean;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
