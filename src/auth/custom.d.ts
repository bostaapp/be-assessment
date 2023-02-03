import type { User } from "./user.entity";

declare global {
  declare namespace Express {
    export interface Request {
      user: Partial<User>;
    }
  }
}
