const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class InitSchema1693232957145 {
    name = 'InitSchema1693232957145'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "provider" character varying NOT NULL DEFAULT 'email', "providerId" character varying, "email" character varying NOT NULL, "emailConfirmed" boolean NOT NULL DEFAULT false, "name" character varying NOT NULL, "password" character varying, "admin" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
    }

    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "user"`);
    }
}
