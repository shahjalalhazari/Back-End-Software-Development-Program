import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProductImagesTable1785773089423 implements MigrationInterface {
    name = 'CreateProductImagesTable1785773089423'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "product_images" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "productId" uuid NOT NULL, "url" text NOT NULL, "altText" character varying, "position" integer NOT NULL DEFAULT '0', "isPrimary" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1974264ea7265989af8392f63a1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b367708bf720c8dd62fc683316" ON "product_images"  ("productId") `);
        await queryRunner.query(`ALTER TABLE "product_images" ADD CONSTRAINT "FK_b367708bf720c8dd62fc6833161" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_images" DROP CONSTRAINT "FK_b367708bf720c8dd62fc6833161"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b367708bf720c8dd62fc683316"`);
        await queryRunner.query(`DROP TABLE "product_images"`);
    }

}
