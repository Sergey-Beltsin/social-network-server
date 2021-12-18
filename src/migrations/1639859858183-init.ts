import {MigrationInterface, QueryRunner} from "typeorm";

export class init1639859858183 implements MigrationInterface {
    name = 'init1639859858183'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "friend_request" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" character varying NOT NULL, "creatorId" uuid, "receiverId" uuid, CONSTRAINT "PK_4c9d23ff394888750cf66cac17c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "profile" ("id" uuid NOT NULL, "created" TIMESTAMP NOT NULL DEFAULT now(), "bio" character varying NOT NULL, "username" character varying NOT NULL, "name" character varying NOT NULL, "surname" character varying NOT NULL, CONSTRAINT "UQ_d80b94dc62f7467403009d88062" UNIQUE ("username"), CONSTRAINT "PK_3dd8bfc97e4a77c70971591bdcb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "posts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "likes" text NOT NULL, "content" character varying(512) NOT NULL, "profileId" uuid, CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password" character varying NOT NULL, "profileId" uuid, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "REL_b1bda35cdb9a2c1b777f5541d8" UNIQUE ("profileId"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "friend_request" ADD CONSTRAINT "FK_23d2e19d3fa528c5ad8676d87da" FOREIGN KEY ("creatorId") REFERENCES "profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "friend_request" ADD CONSTRAINT "FK_470e723fdad9d6f4981ab2481eb" FOREIGN KEY ("receiverId") REFERENCES "profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "FK_62d7b65c760c8957c32a110c717" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_b1bda35cdb9a2c1b777f5541d87" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_b1bda35cdb9a2c1b777f5541d87"`);
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_62d7b65c760c8957c32a110c717"`);
        await queryRunner.query(`ALTER TABLE "friend_request" DROP CONSTRAINT "FK_470e723fdad9d6f4981ab2481eb"`);
        await queryRunner.query(`ALTER TABLE "friend_request" DROP CONSTRAINT "FK_23d2e19d3fa528c5ad8676d87da"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "posts"`);
        await queryRunner.query(`DROP TABLE "profile"`);
        await queryRunner.query(`DROP TABLE "friend_request"`);
    }

}
