import "./common/env-validation";

import fastify from "fastify";
import { configureSwagger } from "./common/configure-swagger";
import { dbDataSource } from "./db/datasource";
import { authenticateDecorator } from "./modules/auth/utils/authenticate.decorator";
import { configureHandlers } from "./common/configure-handlers";
import { configureDiContainer } from "./common/di/configure-di-container";

async function bootstrap() {
  await dbDataSource.initialize();

  const app = fastify();

  configureDiContainer(app);
  app.register(authenticateDecorator);
  configureSwagger(app);
  configureHandlers(app);

  const address = await app.listen({
    port: +process.env.PORT!,
    host: "0.0.0.0",
  });

  console.log(`Server listening at ${address}`);
}

if (require.main === module) {
  bootstrap().catch((err) => {
    console.error(err);
    process.exit(1);
  });

  process.on("unhandledRejection", (err) => {
    console.error(err);
    process.exit(1);
  });
}
