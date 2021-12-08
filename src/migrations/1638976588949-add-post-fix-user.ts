import { MigrationInterface, QueryRunner } from 'typeorm';

export class addPostFixUser1638976588949 implements MigrationInterface {
  name = 'addPostFixUser1638976588949';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "profile" DROP CONSTRAINT "FK_ee5cabf80489cd87b4eebaa75c1"`,
    );
    await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "postsId"`);
    await queryRunner.query(`ALTER TABLE "post" ADD "profileId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_b1bda35cdb9a2c1b777f5541d87"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "post" ADD CONSTRAINT "FK_970844fcd10c2b6df7c1b49eacf" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_b1bda35cdb9a2c1b777f5541d87" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_b1bda35cdb9a2c1b777f5541d87"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post" DROP CONSTRAINT "FK_970844fcd10c2b6df7c1b49eacf"`,
    );
    await queryRunner.query(
      `CREATE SEQUENCE IF NOT EXISTS "profile_id_seq" OWNED BY "profile"."id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" ALTER COLUMN "id" SET DEFAULT nextval('"profile_id_seq"')`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_b1bda35cdb9a2c1b777f5541d87" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "profileId"`);
    await queryRunner.query(`ALTER TABLE "profile" ADD "postsId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "profile" ADD CONSTRAINT "FK_ee5cabf80489cd87b4eebaa75c1" FOREIGN KEY ("postsId") REFERENCES "post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
