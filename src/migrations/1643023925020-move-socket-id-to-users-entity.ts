import {MigrationInterface, QueryRunner} from "typeorm";

export class moveSocketIdToUsersEntity1643023925020 implements MigrationInterface {
    name = 'moveSocketIdToUsersEntity1643023925020'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "socketId"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "socketId" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "socketId"`);
        await queryRunner.query(`ALTER TABLE "profile" ADD "socketId" character varying`);
    }

}
