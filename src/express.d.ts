import { AuthUser } from "./auth/types/auth_user";

declare global {
  namespace Express {
    interface User extends AuthUser {}
  }
}
