import { join } from 'path';

import { ConnectionOptions, DefaultNamingStrategy, NamingStrategyInterface } from 'typeorm';
import { snakeCase } from 'typeorm/util/StringUtils';
import { types } from 'pg';

import { DATABSE_CONFIG } from './config';

types.setTypeParser(20, function (val) {
  return parseInt(val);
});
class CustomNamingStrategy extends DefaultNamingStrategy implements NamingStrategyInterface {
  tableName(targetName: string, userSpecifiedName: string): string {
    return userSpecifiedName ? userSpecifiedName : snakeCase(targetName);
  }

  columnName(propertyName: string, customName: string, embeddedPrefixes: string[]): string {
    return snakeCase(embeddedPrefixes.concat(customName ? customName : propertyName).join('_'));
  }

  columnNameCustomized(customName: string): string {
    return customName;
  }

  relationName(propertyName: string): string {
    return snakeCase(propertyName);
  }
}

const dbConfig: ConnectionOptions = {
  type: 'postgres',
  username: DATABSE_CONFIG.username,
  password: DATABSE_CONFIG.password,
  database: DATABSE_CONFIG.database,
  host: DATABSE_CONFIG.host,
  port: DATABSE_CONFIG.port,
  entities: [join(__dirname, '/../entity/*.*')],
  migrations: [join(__dirname, '/../migrations/*')],
  cli: {
    entitiesDir: join(__dirname, '/../entity'),
    migrationsDir: join(__dirname, '/../migrations'),
  },
  synchronize: false,
  namingStrategy: new CustomNamingStrategy(),
  logging: ['error'],
};

export default dbConfig;
