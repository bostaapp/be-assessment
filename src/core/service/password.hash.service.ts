import bcrypt from 'bcrypt';
import { config } from 'dotenv';

config();

export class Encryptor {
  async hashPassword(plainPassword: string): Promise<string> {
    return await bcrypt.hash(plainPassword, 10);
  }

  async compare(plainPassword, hash) {
    return await bcrypt.compare(plainPassword, hash);
  }
}
