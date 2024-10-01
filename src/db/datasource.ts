import "reflect-metadata";
import { DataSource } from "typeorm";
import { join } from "path";

export const dbDataSource = new DataSource({
  type: "postgres",
  host: process.env.POSTGRES_HOST,
  port: +process.env.POSTGRES_PORT!,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [join(__dirname, "entities", "*.entity.{ts,js}")],
  migrations: [join(__dirname, "migrations", "*.{ts,js}")],
  synchronize: false,
  logging: false,
});
