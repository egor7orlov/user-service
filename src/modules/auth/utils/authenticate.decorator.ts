import { Unauthorized } from "http-errors";
import { AuthService } from "../auth.service";
import z from "zod";
import fp from "fastify-plugin";
import { DEP_NAME_AUTH_SERVICE } from "../../../common/di/deps-names";

const tokenPayloadSchema = z.object({
  email: z.string(),
  id: z.string(),
});

export const authenticateDecorator = fp(async function (fastify) {
  fastify.decorate(
    "authenticate",
    async function (req: any, res: any): Promise<void> {
      const token = req.headers.authorization?.split(" ")?.[1];

      if (!token) {
        throw new Unauthorized();
      }

      const authService = req.diScope.resolve(
        DEP_NAME_AUTH_SERVICE,
      ) as AuthService;
      const tokenDecoded: any = authService.verifyToken(token);
      const tokenPayload = tokenPayloadSchema.safeParse(tokenDecoded);

      if (tokenPayload.error) {
        throw new Unauthorized();
      }

      req.user = {
        email: tokenPayload?.data?.email,
        id: tokenPayload?.data?.id,
      };
    },
  );
});
