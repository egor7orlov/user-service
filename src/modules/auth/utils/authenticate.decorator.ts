import { authServiceInstance } from "../auth.service";
import { Unauthorized } from "http-errors";
import { Type } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";

const tokenPayloadSchema = Type.Object({
  email: Type.String(),
  id: Type.String(),
});

export async function authenticateDecorator(req: any, res: any) {
  const token = req.headers.authorization?.split(" ")?.[1];

  if (!token) {
    throw new Unauthorized();
  }

  const tokenDecoded: any = authServiceInstance.verifyToken(token);
  const tokenPayload = Value.Check(tokenPayloadSchema, tokenDecoded);

  if (!tokenPayload) {
    throw new Unauthorized();
  }

  req.user = {
    email: tokenDecoded?.email,
    id: tokenDecoded?.id,
  };
}
