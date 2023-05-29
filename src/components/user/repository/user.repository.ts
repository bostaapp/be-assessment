import { IUser } from '../interface/user.interface';
import { User } from '../model/user.model';

export class UserRepository {
  async read(filter: Object = {}, fields: string = '') {
    try {
      return await User.find(filter).select(fields);
    } catch (error) {
      throw new Error(error);
    }
  }
  
  async readOne(filter: Object = {}, fields: string = '') {
    try {
      return await User.findOne(filter).select(fields);
    } catch (error) {
      throw new Error(error);
    }
  }

  async create(user: IUser) {
    try {
      return await User.create(user);
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(id: string, updatedUser: IUser) {
    try {
      return await User.findByIdAndUpdate(id, updatedUser);
    } catch (error) {
      throw new Error(error);
    }
  }

  async delete(id: string) {
    try {
        return await User.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(error);
    }
  }
}
