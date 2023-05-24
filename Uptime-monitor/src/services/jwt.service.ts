import jwt from "jsonwebtoken";
import env from "../env.config";

const accessTokenOptions = { expiresIn: "7d" };

export class JwtService {
  static generateAccessToken(id: string, email: string): string {
    const accessToken = jwt.sign(
      { id, email },
      env.JWT_TOKEN,
      accessTokenOptions
    );

    return accessToken;
  }

  static verify(token: string) {
    const payload = jwt.verify(token, env.JWT_TOKEN);
    return payload;
  }
}
