import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  ManyToMany,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { User } from './user.entity';
import { UrlCheck } from './url-check.entity';

@Entity()
export class Tag extends BaseEntity {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  id: string;

  @BeforeInsert()
  setID(): void {
    this.id = `tag_${uuidv4()}`;
  }

  @Column()
  name: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.tags)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToMany(() => UrlCheck)
  urlChecks: UrlCheck[];
}
