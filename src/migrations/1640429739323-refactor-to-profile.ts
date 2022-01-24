import {MigrationInterface, QueryRunner} from "typeorm";

export class refactorToProfile1640429739323 implements MigrationInterface {
    name = 'refactorToProfile1640429739323'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_446251f8ceb2132af01b68eb593"`);
        await queryRunner.query(`CREATE TABLE "conversation_users_profile" ("conversationId" uuid NOT NULL, "profileId" uuid NOT NULL, CONSTRAINT "PK_be957df11bacf29143c4899f43d" PRIMARY KEY ("conversationId", "profileId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d55e4ff26bf36fa9c9d69076ed" ON "conversation_users_profile" ("conversationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_f68c97d29d21fd49f9705d2362" ON "conversation_users_profile" ("profileId") `);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_446251f8ceb2132af01b68eb593" FOREIGN KEY ("userId") REFERENCES "profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "conversation_users_profile" ADD CONSTRAINT "FK_d55e4ff26bf36fa9c9d69076ed0" FOREIGN KEY ("conversationId") REFERENCES "conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "conversation_users_profile" ADD CONSTRAINT "FK_f68c97d29d21fd49f9705d2362d" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "conversation_users_profile" DROP CONSTRAINT "FK_f68c97d29d21fd49f9705d2362d"`);
        await queryRunner.query(`ALTER TABLE "conversation_users_profile" DROP CONSTRAINT "FK_d55e4ff26bf36fa9c9d69076ed0"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_446251f8ceb2132af01b68eb593"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f68c97d29d21fd49f9705d2362"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d55e4ff26bf36fa9c9d69076ed"`);
        await queryRunner.query(`DROP TABLE "conversation_users_profile"`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_446251f8ceb2132af01b68eb593" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
