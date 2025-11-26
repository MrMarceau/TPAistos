import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDebt1701020000000 implements MigrationInterface {
  name = 'CreateDebt1701020000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);
    await queryRunner.query(`CREATE TYPE "public"."debt_status_enum" AS ENUM('PENDING', 'PAID')`);
    await queryRunner.query(`
      CREATE TABLE "debt" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "name" character varying NOT NULL,
        "email" character varying NOT NULL,
        "debtSubject" character varying NOT NULL,
        "debtAmount" numeric(12,2) NOT NULL,
        "status" "public"."debt_status_enum" NOT NULL DEFAULT 'PENDING',
        "stripePaymentIntentId" character varying,
        "paidAt" TIMESTAMP,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_debt_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_debt_email_subject" UNIQUE ("email", "debtSubject")
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_debt_status" ON "debt" ("status")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_debt_status"`);
    await queryRunner.query(`DROP TABLE "debt"`);
    await queryRunner.query(`DROP TYPE "public"."debt_status_enum"`);
  }
}
