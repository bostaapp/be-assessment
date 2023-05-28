import { IUser } from '../interface/user.interface';
import { UserRepository } from '../repository/user.repository';

export class UserService {
  private userRepository = new UserRepository();

  async all() {
    return await this.userRepository.read();
  }

  async create(user: IUser) {
    return await this.userRepository.create(user);
  }

  async userExist(filter: Object) {
    const user = await this.userRepository.read(filter);
    if (user.length) {
      return true;
    } else {
      return false;
    }
  }

  async updateUser(id: string, user: IUser) {
    return await this.userRepository.update(id, user);
  }

  async getByEmail(email: string) {
    const data = await this.userRepository.read({ email });
    if (data.length) {
      return data[0];
    } else {
      return null;
    }
  }
}
