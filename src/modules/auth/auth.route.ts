import { Type } from "@sinclair/typebox";
import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { AuthService } from "./auth.service";

export const authRoute: FastifyPluginAsyncTypebox = async function (app, opts) {
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
      const result = await req.diScope
        .resolve<AuthService>("authService")
        .register({
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
      const result = await req.diScope
        .resolve<AuthService>("authService")
        .login({
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
