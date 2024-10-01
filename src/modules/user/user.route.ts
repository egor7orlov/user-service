import { UserService } from "./user.service";
import { DEP_NAME_USER_SERVICE } from "../../common/di/deps-names";
import { FastifyInstance } from "fastify";
import {
  getPaginatedResponseSchema,
  paginationSchema,
} from "../../common/schemas/pagination.schema";
import { userResponseSchema } from "../../common/schemas/user.schema";

export const userRoute = async function (app: FastifyInstance, opts: any) {
  app.get(
    "/me",
    {
      onRequest: [(app as any).authenticate],
      schema: {
        security: [{ bearerAuth: [] }],
        tags: ["User"],
        response: {
          200: userResponseSchema,
        },
      },
    },
    async (req: any, res: any) => {
      const user = (req as any).user;
      const userService = req.diScope.resolve(
        DEP_NAME_USER_SERVICE,
      ) as UserService;
      const result = await userService.getUserByEmailOrFail(user?.email);

      return {
        id: result.id,
        email: result.email,
      };
    },
  );

  app.get(
    "/",
    {
      onRequest: [(app as any).authenticate],
      schema: {
        security: [{ bearerAuth: [] }],
        tags: ["User"],
        querystring: paginationSchema,
        response: {
          200: getPaginatedResponseSchema({
            type: "array",
            items: userResponseSchema,
          }),
        },
      },
    },
    async (req: any, res: any) => {
      const userService = req.diScope.resolve(
        DEP_NAME_USER_SERVICE,
      ) as UserService;
      const result = await userService.getManyUsersWithTotal({
        page: req.query.page,
        limit: req.query.limit,
      });

      return {
        data: result.users.map((user) => ({
          id: user.id,
          email: user.email,
        })),
        total: result.total,
        page: req.query.page,
        limit: req.query.limit,
      };
    },
  );
};
