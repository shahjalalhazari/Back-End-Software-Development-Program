import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateStoreTable1785000798779 implements MigrationInterface {
    name = 'CreateStoreTable1785000798779'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."stores_status_enum" AS ENUM('PENDING_APPROVAL', 'ACTIVE', 'INACTIVE', 'SUSPENDED', 'REJECTED')`);
        await queryRunner.query(`CREATE TABLE "stores" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "name" character varying(100) NOT NULL, "slug" character varying NOT NULL, "description" text, "logo" character varying, "status" "public"."stores_status_enum" NOT NULL DEFAULT 'PENDING_APPROVAL', "storeEmail" character varying(255) NOT NULL, "storePhoneNumber" character varying(15), "address" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_790b2968701a6ff5ff383237765" UNIQUE ("slug"), CONSTRAINT "REL_f36d697e265ed99b80cae6984c" UNIQUE ("userId"), CONSTRAINT "PK_7aa6e7d71fa7acdd7ca43d7c9cb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f36d697e265ed99b80cae6984c" ON "stores"  ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_a205ca5a37fa5e10005f003aaf" ON "stores"  ("name") `);
        await queryRunner.query(`CREATE INDEX "IDX_790b2968701a6ff5ff38323776" ON "stores"  ("slug") `);
        await queryRunner.query(`CREATE INDEX "IDX_53a5f515d8767f635e80b5159b" ON "stores"  ("status") `);
        await queryRunner.query(`ALTER TABLE "stores" ADD CONSTRAINT "FK_f36d697e265ed99b80cae6984c9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stores" DROP CONSTRAINT "FK_f36d697e265ed99b80cae6984c9"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_53a5f515d8767f635e80b5159b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_790b2968701a6ff5ff38323776"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a205ca5a37fa5e10005f003aaf"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f36d697e265ed99b80cae6984c"`);
        await queryRunner.query(`DROP TABLE "stores"`);
        await queryRunner.query(`DROP TYPE "public"."stores_status_enum"`);
    }

}
