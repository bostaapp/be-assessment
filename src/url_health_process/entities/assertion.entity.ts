import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UrlHealthProcess } from "./url_health_process.entity";

@Entity()
export class Assertion {
  constructor(statusCode: number) {
    this.statusCode = statusCode;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  statusCode: number;

  @OneToOne(
    () => UrlHealthProcess,
    (urlHealthProcess) => urlHealthProcess.assertion,
  )
  urlHealthProcess: UrlHealthProcess[];
}
