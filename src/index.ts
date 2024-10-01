import "./common/env-validation";

import fastify, { FastifyInstance } from "fastify";
import { dbDataSource } from "./db/datasource";
import { HttpError, InternalServerError } from "http-errors";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { authRoute } from "./modules/auth/auth.route";
import { authenticateDecorator } from "./modules/auth/utils/authenticate.decorator";
import { userRoute } from "./modules/user/user.route";

async function configureSwagger(app: FastifyInstance) {
  await app.register(swagger, {
    openapi: {
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
          },
        },
      },
    },
  });
  await app.register(swaggerUi, {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "full",
      deepLinking: false,
    },
    uiHooks: {
      onRequest: function (request, reply, next) {
        next();
      },
      preHandler: function (request, reply, next) {
        next();
      },
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject, request, reply) => {
      return swaggerObject;
    },
    transformSpecificationClone: true,
  });
}

async function bootstrap() {
  await dbDataSource.initialize();

  const app = fastify({ logger: true }).withTypeProvider<TypeBoxTypeProvider>();

  app.decorate("authenticate", authenticateDecorator);

  await configureSwagger(app);

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
