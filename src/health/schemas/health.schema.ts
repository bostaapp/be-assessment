import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { HydratedDocument, Types } from "mongoose";
import { UrlHealthProcess } from "../../url_health_process/schemas/url_health_process.schema";
import { User } from "../../user/schemas/user.schema";

export type HealthDocument = HydratedDocument<Health>;

@Schema({ timestamps: { updatedAt: false }, id: true })
export class Health {
  @ApiProperty({ examples: ["UP", "DOWN"] })
  @Prop({ required: true })
  status: "UP" | "DOWN";

  @ApiProperty({ examples: ["200", "500"] })
  @Prop()
  responseTime: number = 0;

  @Prop()
  time: number = 0;

  @ApiProperty({ description: "The error message if the status is DOWN" })
  @Prop()
  error: string;

  @Prop({ type: Types.ObjectId, ref: User.name })
  owner: User;

  @Prop({ type: Types.ObjectId, ref: UrlHealthProcess.name })
  process: UrlHealthProcess;

  @ApiProperty({ description: "The date this entry was created" })
  createdAt: Date;
}

export const HealthSchema = SchemaFactory.createForClass(Health);
