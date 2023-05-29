import { ICheck, ICheckUpdateInfo } from '../interfaces';
import { CheckRepository } from '../repository/check.repository';

export class CheckService {
  private checkRepository = new CheckRepository();

  async create(check: ICheck) {
    return await this.checkRepository.create(check);
  }

  async all(userId: string) {
    return await this.checkRepository.read({ userId });
  }

  async getCheckById(_id: string, userId: string) {
    return await this.checkRepository.readOne({ _id, userId });
  }

  async updateCheck(_id: string, userId: string, updatedCheck: ICheckUpdateInfo) {
    return await this.checkRepository.update({ _id, userId }, updatedCheck);
  }

  async deleteCheck(_id: string, userId: string) {
    return await this.checkRepository.delete({ _id, userId });
  }

  async checkExistByUrl(url: string, userId: string) {
    const check = await this.checkRepository.readOne({ url, userId });
    if (check) {
      return true;
    } else {
      return false;
    }
  }

  async checkExistById(_id: string, userId: string) {
    const check = await this.checkRepository.readOne({ _id, userId });
    if (check) {
      return true;
    } else {
      return false;
    }
  }
}
