import {MigrationInterface, QueryRunner} from "typeorm";

export class moveUserActiveInProfile1642971670656 implements MigrationInterface {
    name = 'moveUserActiveInProfile1642971670656'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile" ADD "isOnline" boolean`);
        await queryRunner.query(`ALTER TABLE "profile" ADD "lastOnline" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "profile" ADD "socketId" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "socketId"`);
        await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "lastOnline"`);
        await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "isOnline"`);
    }

}
