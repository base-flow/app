import * as path from "node:path";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { CacheModule } from "./cache/cache.module";
import type { JwtConfig } from "./config/jwt.config";
import jwtConfig from "./config/jwt.config";
import redisConfig from "./config/redis.config";
import { EntityModule } from "./entity/entity.module";
import { AuthGuard } from "./guards/auth.guard";
import { PersonalModule } from "./personal/personal.module";
import { ProjectModule } from "./project/project.module";
import { UserModule } from "./user/user.module";
import { WorkflowModule } from "./workflow/workflow.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [jwtConfig, redisConfig],
    }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const jwtConfig = configService.get<JwtConfig>("jwt")!;
        return {
          secret: jwtConfig.secret,
          // signOptions: {
          //   expiresIn: configService.get('JWT_EXP'),
          // },
        };
      },
    }),
    AuthModule,
    UserModule,
    ProjectModule,
    EntityModule,
    WorkflowModule,
    PersonalModule,
    CacheModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    AppService,
  ],
})
export class AppModule {}
