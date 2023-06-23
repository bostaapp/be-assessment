import { MigrationInterface, QueryRunner } from 'typeorm';

export class urlcheksTagReportTables1687502594022 implements MigrationInterface {
  name = 'urlcheksTagReportTables1687502594022';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "tag" ("id" character varying(50) NOT NULL, "name" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" character varying(50), CONSTRAINT "PK_8e4052373c579afc1471f526760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "url_check" ("id" character varying(50) NOT NULL, "name" character varying NOT NULL, "url" character varying NOT NULL, "protocol" character varying NOT NULL, "path" character varying NOT NULL, "port" integer, "webhook" real, "timeout" real NOT NULL, "interval" real NOT NULL, "threshold" real NOT NULL, "authentication" text, "assert" text, "http_headers" text NOT NULL DEFAULT '[{"key":"Content-Type","value":"application/json"}]', "ignore_ssl" boolean NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" character varying(50), CONSTRAINT "UQ_f8943ae4cbc0beb67503cf1b593" UNIQUE ("url"), CONSTRAINT "PK_affb9da2186896facaa190cfc9d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "url_check_url_idx" ON "url_check" ("url") `);
    await queryRunner.query(
      `CREATE TABLE "report" ("id" character varying(50) NOT NULL, "status" character varying NOT NULL, "outage" real NOT NULL, "downtime" real NOT NULL, "uptime" real NOT NULL, "response_time" real NOT NULL, "history" text NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "url_check_id" character varying(50), CONSTRAINT "PK_99e4d0bea58cba73c57f935a546" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "deleted_at"`);
    await queryRunner.query(
      `ALTER TABLE "tag" ADD CONSTRAINT "FK_d0be05b78e89aff4791e6189f77" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "url_check" ADD CONSTRAINT "FK_ba8f756824473142e5b914d025d" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "report" ADD CONSTRAINT "FK_373fe498a441ed025368c9d93c3" FOREIGN KEY ("url_check_id") REFERENCES "url_check"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "report" DROP CONSTRAINT "FK_373fe498a441ed025368c9d93c3"`);
    await queryRunner.query(`ALTER TABLE "url_check" DROP CONSTRAINT "FK_ba8f756824473142e5b914d025d"`);
    await queryRunner.query(`ALTER TABLE "tag" DROP CONSTRAINT "FK_d0be05b78e89aff4791e6189f77"`);
    await queryRunner.query(`ALTER TABLE "user" ADD "deleted_at" TIMESTAMP WITH TIME ZONE`);
    await queryRunner.query(`DROP TABLE "report"`);
    await queryRunner.query(`DROP INDEX "public"."url_check_url_idx"`);
    await queryRunner.query(`DROP TABLE "url_check"`);
    await queryRunner.query(`DROP TABLE "tag"`);
  }
}
