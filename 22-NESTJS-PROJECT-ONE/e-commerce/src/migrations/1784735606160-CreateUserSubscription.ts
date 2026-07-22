import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserSubscription1784735606160 implements MigrationInterface {
    name = 'CreateUserSubscription1784735606160'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_subscriptions_status_enum" AS ENUM('ACTIVE', 'EXPIRED', 'CANCELLED', 'SUSPENDED')`);
        await queryRunner.query(`CREATE TABLE "user_subscriptions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "subscriptionId" uuid NOT NULL, "status" "public"."user_subscriptions_status_enum" NOT NULL DEFAULT 'ACTIVE', "autoRenew" boolean NOT NULL DEFAULT false, "startDate" TIMESTAMP NOT NULL, "endDate" TIMESTAMP NOT NULL, "paymentId" uuid, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9e928b0954e51705ab44988812c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_2dfab576863bc3f84d4f696227" ON "user_subscriptions"  ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_b5091b035afc05879a7e130305" ON "user_subscriptions"  ("subscriptionId") `);
        await queryRunner.query(`CREATE INDEX "IDX_5970e6723936d28477041ebf85" ON "user_subscriptions"  ("status") `);
        await queryRunner.query(`ALTER TABLE "user_subscriptions" ADD CONSTRAINT "FK_2dfab576863bc3f84d4f6962274" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_subscriptions" ADD CONSTRAINT "FK_b5091b035afc05879a7e130305d" FOREIGN KEY ("subscriptionId") REFERENCES "subscriptions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_subscriptions" DROP CONSTRAINT "FK_b5091b035afc05879a7e130305d"`);
        await queryRunner.query(`ALTER TABLE "user_subscriptions" DROP CONSTRAINT "FK_2dfab576863bc3f84d4f6962274"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5970e6723936d28477041ebf85"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b5091b035afc05879a7e130305"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2dfab576863bc3f84d4f696227"`);
        await queryRunner.query(`DROP TABLE "user_subscriptions"`);
        await queryRunner.query(`DROP TYPE "public"."user_subscriptions_status_enum"`);
    }

}
