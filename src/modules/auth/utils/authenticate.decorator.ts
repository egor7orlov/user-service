import { Unauthorized } from "http-errors";
import { Type } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";
import { AuthService } from "../auth.service";

const tokenPayloadSchema = Type.Object({
  email: Type.String(),
  id: Type.String(),
});

export async function authenticateDecorator(req: any, res: any) {
  const token = req.headers.authorization?.split(" ")?.[1];

  if (!token) {
    throw new Unauthorized();
  }

  const authService = req.diScope.resolve("authService") as AuthService;
  const tokenDecoded: any = authService.verifyToken(token);
  const tokenPayload = Value.Check(tokenPayloadSchema, tokenDecoded);

  if (!tokenPayload) {
    throw new Unauthorized();
  }

  req.user = {
    email: tokenDecoded?.email,
    id: tokenDecoded?.id,
  };
}
