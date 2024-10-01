import { Type } from "@sinclair/typebox";
import { authServiceInstance } from "./auth.service";
import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";

export const authRoute: FastifyPluginAsyncTypebox = async function (
  app,
  opts,
) {
  app.post(
    "/register",
    {
      schema: {
        tags: ["Auth"],
        body: Type.Object({
          email: Type.String({ format: "email" }),
          password: Type.String({ minLength: 8 }),
        }),
        response: {
          200: Type.Object({
            id: Type.String(),
            email: Type.String(),
            accessToken: Type.String(),
          }),
        },
      },
    },
    async (req, res) => {
      const { email, password } = req.body;
      const result = await authServiceInstance.register({
        email,
        password,
      });

      return {
        id: result.id,
        email: result.email,
        accessToken: result.accessToken,
      };
    },
  );

  app.post(
    "/login",
    {
      schema: {
        tags: ["Auth"],
        body: Type.Object({
          email: Type.String({ format: "email" }),
          password: Type.String({ minLength: 1 }),
        }),
        response: {
          200: Type.Object({
            id: Type.String(),
            email: Type.String(),
            accessToken: Type.String(),
          }),
        },
      },
    },
    async (req, res) => {
      const { email, password } = req.body;

      const result = await authServiceInstance.login({
        email,
        password,
      });

      return {
        id: result.id,
        email: result.email,
        accessToken: result.accessToken,
      };
    },
  );
};
