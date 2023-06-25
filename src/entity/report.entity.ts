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
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { UrlCheck } from './url-check.entity';

@Entity()
export class Report extends BaseEntity {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  id: string;

  @BeforeInsert()
  setID(): void {
    this.id = `rpt_${uuidv4()}`;
  }

  @Column()
  status: string;

  @Column('real')
  outage: number;

  @Column('real')
  downtime: number;

  @Column('real')
  uptime: number;

  @Column('real')
  responseTime: number;

  @Column('simple-json')
  history: { timestamp: Date; responseTime: number };

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @ManyToOne(() => UrlCheck, (urlCheck) => urlCheck.reports, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'urlCheckId' })
  urlCheck: UrlCheck;
}
