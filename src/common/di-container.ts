import { FastifyInstance } from "fastify";
import { diContainer, fastifyAwilixPlugin } from "@fastify/awilix";
import { asFunction, asValue } from "awilix";
import { dbDataSource } from "../db/datasource";
import { UserEntity } from "../db/entities/user.entity";
import { UserService } from "../modules/user/user.service";
import { AuthService } from "../modules/auth/auth.service";

export async function configureDiContainer(app: FastifyInstance) {
  await app.register(fastifyAwilixPlugin, {
    disposeOnClose: true,
    disposeOnResponse: true,
    strictBooleanEnforced: true,
    container: diContainer,
  });
  diContainer.register({
    userRepo: asValue(dbDataSource.getRepository(UserEntity)),
    userService: asFunction(({ userRepo }) => {
      return new UserService(userRepo);
    }),
    authService: asFunction(({ userRepo }) => {
      return new AuthService(userRepo);
    }),
  });
}
