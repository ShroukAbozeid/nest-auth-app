
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}`})

var dbConfig = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  migrations: ['migrations/*.js'],
  migrationsRun: process.env.RUN_MIGRATIONS,
  synchronize: process.env.DB_SYNC
}
console.log(process.env.POSTGRES_USER)

switch (process.env.NODE_ENV) {
  case 'development':
    Object.assign(dbConfig, {
      entities: ['**/*.entity.js'],
    });
    break;
  case 'test':
    Object.assign(dbConfig, {
      entities: ['**/*.entity.ts'],
    });
    break;
  case 'production':
    Object.assign(dbConfig, {
      entities: ['**/*.entity.js'],
      ssl: {
        rejectUnauthorized: false
      }
    });
    break;
  default:
    throw new Error('unknown environment');
}

export const DbConfig = dbConfig;
