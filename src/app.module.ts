import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import z from 'zod';

const dbConfigSchema = z.object({
  DB_TYPE: z.enum(['mysql', 'postgres']),
  DB_HOST: z.string(),
  DB_PORT: z.number(),
  DB_USERNAME: z.string(),
  DB_PASSWORD: z.string(),
  DB_DATABASE: z.string(),
});

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        await ConfigModule.envVariablesLoaded;
        const dbConfig = dbConfigSchema.parse({
          ...process.env,
          DB_PORT: parseInt(process.env.DB_PORT ?? 'not found'),
        });
        return {
          type: dbConfig.DB_TYPE,
          host: dbConfig.DB_HOST,
          port: dbConfig.DB_PORT,
          username: dbConfig.DB_USERNAME,
          password: dbConfig.DB_PASSWORD,
          database: dbConfig.DB_DATABASE,
          autoLoadEntities: true,
          synchronize: true,
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
