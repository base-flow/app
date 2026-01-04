import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import chalk from "chalk";
import { AppModule } from "./app.module";
import { getLocalIP } from "./utils";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      // whitelist: false,
      // forbidNonWhitelisted: false, // 非 DTO 属性会直接报错
    }),
  );
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`\n🚀...Baseflow Server running at ${chalk.green.underline(`http://localhost:${port}`)}`);
  console.log(`🚀...Baseflow Server running at ${chalk.green.underline(`http://${getLocalIP()}:${port}`)}\n`);
}
bootstrap();
