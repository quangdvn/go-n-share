import { ConnectionOptions } from 'typeorm';
import { DB_TYPE } from './constants';

const typeOrmConfig: ConnectionOptions = {
  type: DB_TYPE,
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname + '/**/*.entity.ts', __dirname + '/**/*.entity.js'],
  migrationsRun: false,
  logging: true,
  migrationsTableName: 'migrations',
  migrations: [
    __dirname + '/migrations/**/*.ts',
    __dirname + '/migrations/**/*.js',
  ],
  synchronize: false,
  cli: {
    migrationsDir: 'src/migrations',
  },
};

export = typeOrmConfig;
