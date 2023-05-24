import { Request, Response, NextFunction } from "express";
import { JwtService } from "../services/jwt.service";

interface UserPayload {
  id: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}
export const Auth = (req: Request, res: Response, next: NextFunction) => {
  let token: string;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else {
    return res.status(401).json({
      message: "Aceess DENIED, please signin and continue..",
    });
  }
  try {
    const payload = JwtService.verify(token) as UserPayload;
    req.currentUser = payload;
  } catch (err) {
    // TODO:catch error if any
  }

  next();
};
