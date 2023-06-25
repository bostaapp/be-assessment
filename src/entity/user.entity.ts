import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  Index,
  BaseEntity,
  OneToMany,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { UrlCheck } from './url-check.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  id: string;

  @BeforeInsert()
  setID(): void {
    this.id = `usr_${uuidv4()}`;
  }

  @Index('user_auth_id_idx')
  @Column()
  authId: string;

  @Column({ unique: true })
  email: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @OneToMany(() => UrlCheck, (urlCheck) => urlCheck.user)
  urlChecks: UrlCheck[];
}
