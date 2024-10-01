import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1727731524138 implements MigrationInterface {
  name = "Init1727731524138";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "users"
                             (
                                 "createdAt" TIMESTAMP              NOT NULL DEFAULT now(),
                                 "updatedAt" TIMESTAMP              NOT NULL DEFAULT now(),
                                 "deletedAt" TIMESTAMP,
                                 "id"        uuid                   NOT NULL DEFAULT uuid_generate_v4(),
                                 "email"     character varying(255) NOT NULL,
                                 "password"  character varying(255) NOT NULL,
                                 CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
                             )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
