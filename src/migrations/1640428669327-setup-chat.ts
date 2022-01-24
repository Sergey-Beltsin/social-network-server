import { MigrationInterface, QueryRunner } from 'typeorm';

export class setupChat1640428669327 implements MigrationInterface {
  name = 'setupChat1640428669327';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "active_conversation" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "socketId" character varying NOT NULL, "userId" character varying NOT NULL, "conversationId" character varying NOT NULL, CONSTRAINT "PK_6f97b383c8aae028538526304ca" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "message" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "message" character varying NOT NULL, "created" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, "conversationId" uuid, CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "conversation" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_864528ec4274360a40f66c29845" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "conversation_users_users" ("conversationId" uuid NOT NULL, "usersId" uuid NOT NULL, CONSTRAINT "PK_076bf99e9eeaa1c483bfae78815" PRIMARY KEY ("conversationId", "usersId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_360ad3e31b30b769923aee131d" ON "conversation_users_users" ("conversationId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5bddbb73e052d228d013892322" ON "conversation_users_users" ("usersId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "message" ADD CONSTRAINT "FK_446251f8ceb2132af01b68eb593" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "message" ADD CONSTRAINT "FK_7cf4a4df1f2627f72bf6231635f" FOREIGN KEY ("conversationId") REFERENCES "conversation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "conversation_users_users" ADD CONSTRAINT "FK_360ad3e31b30b769923aee131d7" FOREIGN KEY ("conversationId") REFERENCES "conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "conversation_users_users" ADD CONSTRAINT "FK_5bddbb73e052d228d0138923228" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "conversation_users_users" DROP CONSTRAINT "FK_5bddbb73e052d228d0138923228"`,
    );
    await queryRunner.query(
      `ALTER TABLE "conversation_users_users" DROP CONSTRAINT "FK_360ad3e31b30b769923aee131d7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "message" DROP CONSTRAINT "FK_7cf4a4df1f2627f72bf6231635f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "message" DROP CONSTRAINT "FK_446251f8ceb2132af01b68eb593"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5bddbb73e052d228d013892322"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_360ad3e31b30b769923aee131d"`,
    );
    await queryRunner.query(`DROP TABLE "conversation_users_users"`);
    await queryRunner.query(`DROP TABLE "conversation"`);
    await queryRunner.query(`DROP TABLE "message"`);
    await queryRunner.query(`DROP TABLE "active_conversation"`);
  }
}
