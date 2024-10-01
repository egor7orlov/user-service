import { authServiceInstance } from "../auth.service";

export async function authenticate(req: any, res: any) {
  const tokenPayload = authServiceInstance.verifyToken(
    req.headers.authorization.split(" ")[1],
  );

  console.log(tokenPayload);
}
