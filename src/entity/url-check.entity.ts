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
  OneToMany,
  ManyToMany,
  Index,
  Unique,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { User } from './user.entity';
import { Report } from './report.entity';
import { Tag } from './tag.entity';

@Entity()
@Unique(['url', 'user'])
@Index(['id', 'user'])
export class UrlCheck extends BaseEntity {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  id: string;

  @BeforeInsert()
  setID(): void {
    this.id = `urlchk_${uuidv4()}`;
  }

  @Column()
  name: string;

  @Index('url_check_url_idx')
  @Column()
  url: string;

  @Column()
  protocol: string;

  @Column()
  path: string;

  @Column({ nullable: true })
  port: number;

  @Column('real', { nullable: true })
  webhook: number;

  @Column('real')
  timeout: number;

  @Column('real')
  interval: number;

  @Column('real')
  threshold: number;

  @Column('simple-json', { nullable: true })
  authentication: { username: string; password: string };

  @Column('simple-json', { nullable: true })
  assert: { statusCode: number };

  @Column('simple-json', { default: [{ key: 'Content-Type', value: 'application/json' }] })
  httpHeaders: { key: string; value: string }[];

  @Column()
  ignoreSsl: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.urlChecks)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => Report, (report) => report.urlCheck)
  reports: Report[];

  @ManyToMany(() => Tag)
  @JoinColumn()
  tags: Tag[];
}
