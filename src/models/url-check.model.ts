import { getRepository } from 'typeorm';

import { connect } from './index';
import { UrlCheck } from '../entity/url-check.entity';

const getUrlCheckRepository = async () => {
  await connect();
  return getRepository(UrlCheck);
};

export const create = async (urlCheck: ICreateUrlCheckBody, user: IUser): Promise<IUrlCheck> => {
  const urlCheckRepository = await getUrlCheckRepository();

  const createdUrlCheck: IUrlCheck = urlCheckRepository.create({ ...urlCheck, user });
  return urlCheckRepository.save(createdUrlCheck);
};

export const list = async (user: IUser, options: IListOptions): Promise<[IUrlCheck[], number]> => {
  const skip = (options.pageNumber - 1) * options.pageSize;
  const where = { user };

  const queryBuilder = (await getUrlCheckRepository()).createQueryBuilder('urlCheck');
  queryBuilder.select().where(where).orderBy({ created_at: 'DESC' }).take(options.pageSize).skip(skip);

  return queryBuilder.getManyAndCount();
};

export const getUrlCheckById = async (id: string, user: IUser): Promise<IUrlCheck> => {
  const urlCheckRepository = await getUrlCheckRepository();
  return urlCheckRepository.findOne({ id, user });
};

export const getUrlCheckByUrl = async (url: string, user: IUser): Promise<IUrlCheck> => {
  const urlCheckRepository = await getUrlCheckRepository();
  return urlCheckRepository.findOne({ url, user });
};

export const updateUrlCheck = async (id: string, urlCheck: IUpdateUrlCheckBody): Promise<IUrlCheck> => {
  const urlCheckRepository = await getUrlCheckRepository();

  const updatedUrlCheck = urlCheckRepository.create({ ...urlCheck, id });
  return urlCheckRepository.save(updatedUrlCheck);
};

export const remove = async (id: string): Promise<void> => {
  const urlCheckRepository = await getUrlCheckRepository();
  await urlCheckRepository.delete(id);
  return;
};
