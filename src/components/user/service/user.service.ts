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
    const user = await this.userRepository.readOne(filter);
    if (user) {
      return true;
    } else {
      return false;
    }
  }

  async updateUser(id: string, user: IUser) {
    return await this.userRepository.update(id, user);
  }

  async getByEmail(email: string) {
    const user = await this.userRepository.readOne({ email });
    if (user) {
      return user;
    } else {
      return null;
    }
  }
}
