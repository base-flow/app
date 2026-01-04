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
import { FlowModule } from "./flow/flow.module";
import { FlowAppModule } from "./flowApp/flowApp.module";
import { FlowNodeModule } from "./flowNode/flowNode.module";
import { AuthGuard } from "./guards/auth.guard";
import { UserModule } from "./user/user.module";

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
    FlowAppModule,
    FlowModule,
    FlowNodeModule,
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
