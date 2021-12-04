import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const getTypeOrmConfig = async (
  configService: ConfigService | { get: (propertyPath: string) => string },
): Promise<TypeOrmModuleOptions> => ({
  type: 'postgres',

  username: configService.get('DATABASE_USERNAME'),
  password: configService.get('DATABASE_PASSWORD'),
  host: configService.get('DATABASE_HOST'),
  port: +configService.get('DATABASE_PORT'),
  database: configService.get('DATABASE_NAME'),

  entities: [
    configService.get('NODE_ENV') === 'development'
      ? 'src/**/*.entity.ts'
      : 'dist/**/*.entity.js',
  ],

  migrations: [
    configService.get('NODE_ENV') === 'development'
      ? 'src/migrations/*.ts'
      : 'dist/migrations/*.js',
  ],
  migrationsTableName: 'migrations',
  cli: {
    migrationsDir: 'src/migrations',
  },

  ssl: false,
});
