import { MigrationInterface, QueryRunner } from 'typeorm';

export class userTable1687221120226 implements MigrationInterface {
  name = 'userTable1687221120226';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE OR REPLACE FUNCTION update_modified_column()   
      RETURNS TRIGGER AS $$
      BEGIN
        IF row(NEW.*) IS DISTINCT FROM row(OLD.*) THEN
          NEW.updated_at = now(); 
          RETURN NEW;
        ELSE
          RETURN OLD;
        END IF;
      END;
      $$ language 'plpgsql';`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" character varying(50) NOT NULL, "auth_id" character varying NOT NULL, "email" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"));
      CREATE TRIGGER update_user_modtime BEFORE UPDATE ON "user" FOR EACH ROW EXECUTE PROCEDURE update_modified_column();`,
    );
    await queryRunner.query(`CREATE INDEX "user_auth_id_idx" ON "user" ("auth_id") `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."user_auth_id_idx"`);
    await queryRunner.query(`DROP TRIGGER update_user_modtime ON "user"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
