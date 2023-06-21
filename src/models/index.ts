import 'reflect-metadata';
import { Connection, getConnectionManager } from 'typeorm';

import dbConfig from '../config/database';

const connectionManager = getConnectionManager();
let connection: Connection = null;

export const connect = async (): Promise<void> => {
  if (connection === null || !connection.isConnected) {
    connection = connectionManager.create(dbConfig);
    await connection.connect();
    return;
  }
  return;
};
