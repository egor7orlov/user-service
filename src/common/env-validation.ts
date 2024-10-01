import { Type } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";

enum NodeEnv {
  DEVELOPMENT = "development",
  PRODUCTION = "production",
  TEST = "test",
}

const envSchema = Type.Object({
  NODE_ENV: Type.Enum(NodeEnv),
  PORT: Type.String(),
  JWT_SECRET: Type.String(),

  POSTGRES_HOST: Type.String(),
  POSTGRES_PORT: Type.String(),
  POSTGRES_USER: Type.String(),
  POSTGRES_PASSWORD: Type.String(),
  POSTGRES_DB: Type.String(),
});

Value.Parse(envSchema, process.env);
