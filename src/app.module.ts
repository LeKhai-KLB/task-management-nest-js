import { Module } from "@nestjs/common";
import { TasksModule } from "./tasks/tasks.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ConfigValidationSchema } from "./config.schema";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`, ".env"],
      validationSchema: ConfigValidationSchema,
      cache: true,
    }),
    TasksModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const isProduction = configService.get("STAGE") === "prod";

        return {
          ssl: isProduction,
          extra: {
            ssl: isProduction ? { rejectUnauthorized: false } : null,
          },
          type: "postgres",
          host: configService.get("ORM_HOST"),
          port: configService.get("ORM_PORT"),
          username: configService.get("ORM_USERNAME"),
          password: configService.get("ORM_PASSWORD"),
          database: configService.get("ORM_DATABASE"),
          autoLoadEntities: true,
          synchronize: true,
        };
      },
    }),
    AuthModule,
  ],
})
export class AppModule {}
