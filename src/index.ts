import "./common/env-validation";

import fastify, { FastifyInstance } from "fastify";
import { dbDataSource } from "./db/datasource";
import { HttpError, InternalServerError } from "http-errors";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { authPlugin } from "./auth/auth.plugin";
import { authenticate } from "./auth/utils/authenticate";

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

  app.decorate("authenticate", authenticate);

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

  await app.register(authPlugin, { prefix: "/auth" });

  const address = await app.listen({
    port: +process.env.PORT!,
    host: "0.0.0.0",
  });

  console.log(`Server listening at ${address}`);
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
