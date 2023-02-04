import { Tag } from "../../tags/entities/tag.entity";
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import { CreateUrlHealthProcessDto } from "../dto/create-url_health_process.dto";
import { UpdateUrlHealthProcessDto } from "../dto/update-url_health_process.dto";
import { Assertion } from "./assertion.entity";
import { User } from "../../user/entities/user.entity";

@Entity()
@Unique(["name", "user"])
export class UrlHealthProcess {
  constructor(dto?: CreateUrlHealthProcessDto | UpdateUrlHealthProcessDto) {
    if (!dto) return;

    // initializing fields
    this.name = dto.name;
    this.timeout = dto.timeout;
    this.interval = dto.interval;
    this.threshold = dto.threshold;
    this.webhook = dto.webhook;
    this.ignoreSSL = dto.ignoreSSL;
    this.httpHeaders = dto.httpHeaders?.join(";;");
    this.user = dto.user as any;

    // Tedious fields
    if (dto.assert?.statusCode)
      this.assertion = new Assertion(dto.assert.statusCode);

    const url = new URL("/", dto.protocol + "://" + dto.url);
    if (dto.authentication) {
      url.username = dto.authentication?.username ?? "";
      url.password = dto.authentication?.password ?? "";
    }
    url.port = dto.port;
    url.protocol = dto.protocol;
    url.pathname = dto.path;

    this.url = url.toString();

    this.tags = dto.tags.map((tag) => new Tag(tag, dto.user.id));
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  url: string;

  @Column({ nullable: true })
  // Will be its own entity.
  webhook?: string;

  @Column()
  timeout: number;

  @Column()
  interval: number;

  @Column()
  threshold: number;

  @Column({ nullable: true })
  httpHeaders: string;

  @OneToOne(() => Assertion, (assertion) => assertion.urlHealthProcess, {
    nullable: true,
    cascade: true,
  })
  assertion: Assertion;

  @ManyToMany(() => Tag, (tag) => tag.urlHealthProcess, {
    nullable: true,
    cascade: true,
  })
  @JoinTable()
  tags: Tag[];

  @Column()
  ignoreSSL: boolean;

  @ManyToOne(() => User, (user) => user.urls, { nullable: false })
  user: User;
}
