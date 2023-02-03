import { Tag } from "../../tags/entities/tag.entity";
import { UrlHealthProcess } from "../../url_health_process/entities/url_health_process.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ unique: true })
  email: string;

  @OneToMany(() => UrlHealthProcess, (url) => url.user)
  urls: UrlHealthProcess[];

  @OneToMany(() => Tag, (tag) => tag.user)
  tags: Tag[];
}
