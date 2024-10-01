import { Type } from "@sinclair/typebox";
import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { userServiceInstance } from "./user.service";

export const userPlugin: FastifyPluginAsyncTypebox = async function authRoute(app, opts: any) {
  app.post(
    "/me",
    {
      onRequest: [(app as any).authenticate],
      schema: {
        tags: ["User"],
        response: {
          200: Type.Object({
            id: Type.String(),
            email: Type.String(),
          })
        },
      },
    },
    async (req, res) => {
      const result = await userServiceInstance.getUserByEmail(email);

      return {
        id: result.id,
        email: result.email,
      };
    },
  );
}
