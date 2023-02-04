import { User } from "../../user/entities/user.entity";
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import { UrlHealthProcess } from "../../url_health_process/entities/url_health_process.entity";

@Entity()
@Unique(["name", "user"])
export class Tag {
  constructor(name?: string, userId?: number) {
    if (!name || !userId) return;

    this.name = name;
    this.user = { id: userId } as any;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(
    () => UrlHealthProcess,
    (urlHealthProcess) => urlHealthProcess.tags,
  )
  urlHealthProcess: UrlHealthProcess[];

  @ManyToOne(() => User, (user) => user.tags, { nullable: false })
  user: User;
}
