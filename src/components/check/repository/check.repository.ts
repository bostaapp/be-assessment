import { ICheck, ICheckUpdateInfo } from '../interfaces';
import { Check } from '../model/check.model';

export class CheckRepository {
  async create(check: ICheck) {
    try {
      return await Check.create(check);
    } catch (err) {
      throw err;
    }
  }
  async read(filter: Object = {}, fields: string = '') {
    try {
      return await Check.find(filter).select(fields);
    } catch (err) {
      throw err;
    }
  }

  async readOne(filter: Object = {}, fields: string = '') {
    try {
      return await Check.findOne(filter).select(fields);
    } catch (err) {
      throw err;
    }
  }

  async updateOne(_id: string, updatedCheck: ICheck) {
    try {
      return await Check.findByIdAndUpdate(_id, updatedCheck);
    } catch (err) {
      throw err;
    }
  }

  async update(filter: Object = {}, updatedCheck: ICheckUpdateInfo) {
    try {
      return await Check.updateMany(filter, updatedCheck);
    } catch (err) {
      throw err;
    }
  }

  async delete(filter: Object) {
    try {
      return await Check.deleteOne(filter);
    } catch (err) {
      throw err;
    }
  }
}
