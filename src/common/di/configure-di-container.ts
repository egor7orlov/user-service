import { FastifyInstance } from "fastify";
import { diContainer, fastifyAwilixPlugin } from "@fastify/awilix";
import { asFunction, asValue } from "awilix";
import { dbDataSource } from "../../db/datasource";
import { UserEntity } from "../../db/entities/user.entity";
import {
  DEP_NAME_AUTH_SERVICE,
  DEP_NAME_USER_REPO,
  DEP_NAME_USER_SERVICE,
} from "./deps-names";
import { AuthService } from "../../modules/auth/auth.service";
import { UserService } from "../../modules/user/user.service";

export function configureDiContainer(app: FastifyInstance) {
  app.register(fastifyAwilixPlugin, {
    disposeOnClose: true,
    disposeOnResponse: true,
    strictBooleanEnforced: true,
  });

  diContainer.register({
    [DEP_NAME_USER_REPO]: asValue(dbDataSource.getRepository(UserEntity)),
    [DEP_NAME_AUTH_SERVICE]: asFunction((diCtx) => {
      return new AuthService(diCtx[DEP_NAME_USER_REPO]);
    }),
    [DEP_NAME_USER_SERVICE]: asFunction((diCtx) => {
      return new UserService(diCtx[DEP_NAME_USER_REPO]);
    }),
  });
}
