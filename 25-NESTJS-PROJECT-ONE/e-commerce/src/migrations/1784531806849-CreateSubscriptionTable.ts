import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSubscriptionTable1784531806849 implements MigrationInterface {
    name = 'CreateSubscriptionTable1784531806849'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP COLUMN "currency"`);
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP COLUMN "startDate"`);
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP COLUMN "endDate"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD "endDate" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD "startDate" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD "currency" character varying NOT NULL`);
    }

}
