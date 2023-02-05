import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { UrlHealthProcess } from "../../url_health_process/schemas/url_health_process.schema";
import { User } from "../../user/schemas/user.schema";

export type HealthDocument = HydratedDocument<Health>;

@Schema({ timestamps: { updatedAt: false }, id: true })
export class Health {
  @Prop({ required: true })
  status: "UP" | "DOWN";

  @Prop()
  responseTime: number = 0;

  @Prop()
  time: number = 0;

  @Prop()
  error: string;

  @Prop({ type: Types.ObjectId, ref: User.name })
  owner: User;

  @Prop({ type: Types.ObjectId, ref: UrlHealthProcess.name })
  process: UrlHealthProcess;

  createdAt: Date;
}

export const HealthSchema = SchemaFactory.createForClass(Health);
