import "./common/env-validation";

import fastify from "fastify";
import { dbDataSource } from "./db/datasource";
import { HttpError, InternalServerError } from "http-errors";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { authRoute } from "./modules/auth/auth.route";
import { authenticateDecorator } from "./modules/auth/utils/authenticate.decorator";
import { userRoute } from "./modules/user/user.route";
import { configureSwagger } from "./common/swagger";
import { configureDiContainer } from "./common/di-container";

async function bootstrap() {
  await dbDataSource.initialize();

  const app = fastify({ logger: false }).withTypeProvider<TypeBoxTypeProvider>();

  await configureDiContainer(app);
  await configureSwagger(app);

  app.decorate("authenticate", authenticateDecorator);

  app.setErrorHandler((error, req, res) => {
    if (error instanceof HttpError) {
      throw error;
    } else {
      console.error(error);
      throw new InternalServerError();
    }
  });

  app.get("/health", async (req, res) => {
    return "OK\n";
  });

  await app.register(authRoute, { prefix: "/auth" });
  await app.register(userRoute, { prefix: "/user" });

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
