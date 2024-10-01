import { Type } from "@sinclair/typebox";
import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { UserService } from "./user.service";

export const userRoute: FastifyPluginAsyncTypebox = async function (app, opts) {
  app.post(
    "/me",
    {
      onRequest: [(app as any).authenticate],
      schema: {
        security: [{ bearerAuth: [] }],
        tags: ["User"],
        response: {
          200: Type.Object({
            id: Type.String(),
            email: Type.String(),
          }),
        },
      },
    },
    async (req, res) => {
      const user = (req as any).user;
      const result = await req.diScope
        .resolve<UserService>("userService")
        .getUserByEmailOrFail(user?.email);

      return {
        id: result.id,
        email: result.email,
      };
    },
  );
};
