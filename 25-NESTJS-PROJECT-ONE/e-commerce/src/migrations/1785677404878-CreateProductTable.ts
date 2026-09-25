import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProductTable1785677404878 implements MigrationInterface {
    name = 'CreateProductTable1785677404878'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_c44ac33a05b144dd0d9ddcf932"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "storeId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "compareAtPrice" TYPE numeric(10,2)`);
        await queryRunner.query(`CREATE INDEX "IDX_782da5e50e94b763eb63225d69" ON "products"  ("storeId") `);
        await queryRunner.query(`CREATE INDEX "IDX_75895eeb1903f8a17816dafe0a" ON "products"  ("price") `);
        await queryRunner.query(`CREATE INDEX "IDX_1846199852a695713b1f8f5e9a" ON "products"  ("status") `);
        await queryRunner.query(`CREATE INDEX "IDX_63fcb3d8806a6efd53dbc67430" ON "products"  ("createdAt") `);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_782da5e50e94b763eb63225d69d" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_782da5e50e94b763eb63225d69d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_63fcb3d8806a6efd53dbc67430"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1846199852a695713b1f8f5e9a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_75895eeb1903f8a17816dafe0a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_782da5e50e94b763eb63225d69"`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "compareAtPrice" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "storeId"`);
        await queryRunner.query(`CREATE INDEX "IDX_c44ac33a05b144dd0d9ddcf932" ON "products" USING btree ("sku") `);
    }

}
