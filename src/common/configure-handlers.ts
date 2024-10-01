import { FastifyInstance } from "fastify";
import { authRoute } from "../modules/auth/auth.route";
import { userRoute } from "../modules/user/user.route";
import { HttpError, InternalServerError } from "http-errors";

export function configureHandlers(app: FastifyInstance) {
  app.get("/health", async (req, res) => {
    return "OK\n";
  });
  app.register(authRoute, { prefix: "/auth" });
  app.register(userRoute, { prefix: "/user" });
  app.setErrorHandler((error, req, res) => {
    if (error instanceof HttpError) {
      throw error;
    } else {
      console.error(error);
      throw new InternalServerError();
    }
  });
}
