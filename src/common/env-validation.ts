import z from "zod";

const z_number = z
  .string()
  .regex(/^\d+$/, "Must only contain digits")
  .transform(Number);
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]),
  PORT: z_number,
  JWT_SECRET: z.string(),

  PG_HOST: z.string(),
  PG_PORT: z_number,
  PG_USER: z.string(),
  PG_PASS: z.string(),
  PG_DB: z.string(),
});

envSchema.parse(process.env);
