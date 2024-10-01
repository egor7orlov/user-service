import { AuthService } from "./auth.service";
import { DEP_NAME_AUTH_SERVICE } from "../../common/di/deps-names";
import { loginInputSchema, loginResponseSchema } from "../../common/schemas/user.schema";

export const authRoute = async function (app: any, opts: any) {
  app.post(
    "/register",
    {
      schema: {
        tags: ["Auth"],
        body: loginInputSchema,
        response: {
          200: loginResponseSchema,
        },
      },
    },
    async (req: any, res: any) => {
      const { email, password } = req.body;
      const authService = req.diScope.resolve(
        DEP_NAME_AUTH_SERVICE,
      ) as AuthService;
      const result = await authService.register({
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
        body: loginInputSchema,
        response: {
          200: loginResponseSchema,
        },
      },
    },
    async (req: any, res: any) => {
      const { email, password } = req.body;
      const authService = req.diScope.resolve(
        DEP_NAME_AUTH_SERVICE,
      ) as AuthService;
      const result = await authService.login({
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
