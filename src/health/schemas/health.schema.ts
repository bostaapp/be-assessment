import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { UrlHealthProcess } from "../../url_health_process/schemas/url_health_process.schema";
import { User } from "../../user/schemas/user.schema";

export type HealthDocument = HydratedDocument<Health>;

@Schema({ timestamps: { createdAt: true }, id: true })
export class Health {
  @Prop({ required: true })
  status: "UP" | "DOWN";

  @Prop()
  responseTime: number = 0;

  @Prop()
  error: string;

  @Prop({ type: Types.ObjectId, ref: User.name })
  owner: User;

  @Prop({ required: true })
  ownerId: string;

  @Prop({ type: Types.ObjectId, ref: UrlHealthProcess.name })
  process: UrlHealthProcess;

  @Prop({ required: true })
  processId: string;
}

export const HealthSchema = SchemaFactory.createForClass(Health);
