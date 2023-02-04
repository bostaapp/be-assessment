import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, HydratedDocument } from "mongoose";
import { User } from "../../user/schemas/user.schema";

export type UHPDocument = HydratedDocument<UrlHealthProcess>;

export enum Protocol {
  HTTP = "HTTP",
  HTTPS = "HTTPS",
  TCP = "TCP",
}

@Schema({ _id: false })
export class Authentication extends Document {
  @Prop({ required: true })
  username: string;

  @Prop()
  password: string;
}

@Schema({ _id: false })
export class HTTPHeader extends Document {
  @Prop({ required: true })
  key: string;

  @Prop({ required: true })
  value: string;
}

@Schema({ _id: false })
export class Assertion extends Document {
  @Prop({ required: true })
  statusCode: number;
}

@Schema()
export class UrlHealthProcess extends Document {
  @Prop({ unique: true, trim: true })
  name: string;

  @Prop()
  url: string;

  @Prop()
  protocol?: Protocol;

  @Prop()
  webhook?: string;

  @Prop({ type: Number })
  timeout = 5;

  @Prop()
  interval: number = 10 * 60;

  @Prop({ type: Number })
  threshold = 1;

  @Prop({ required: false })
  authentication?: Authentication;

  @Prop()
  httpHeaders?: HTTPHeader[];

  @Prop()
  assertion?: Assertion;

  @Prop()
  tags: string[];

  @Prop({ type: Boolean })
  ignoreSSL = false;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  user: mongoose.Types.ObjectId;
}

export const UrlSchema = SchemaFactory.createForClass(UrlHealthProcess);
