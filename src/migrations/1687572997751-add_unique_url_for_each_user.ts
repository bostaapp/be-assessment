import {MigrationInterface, QueryRunner} from "typeorm";

export class addUniqueUrlForEachUser1687572997751 implements MigrationInterface {
    name = 'addUniqueUrlForEachUser1687572997751'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "url_check" DROP CONSTRAINT "UQ_f8943ae4cbc0beb67503cf1b593"`);
        await queryRunner.query(`CREATE INDEX "IDX_f7636b68a7e47d19865628778d" ON "url_check" ("id", "user_id") `);
        await queryRunner.query(`ALTER TABLE "url_check" ADD CONSTRAINT "UQ_d36c70a0f940eaede4b01a670ff" UNIQUE ("url", "user_id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "url_check" DROP CONSTRAINT "UQ_d36c70a0f940eaede4b01a670ff"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f7636b68a7e47d19865628778d"`);
        await queryRunner.query(`ALTER TABLE "url_check" ADD CONSTRAINT "UQ_f8943ae4cbc0beb67503cf1b593" UNIQUE ("url")`);
    }

}
