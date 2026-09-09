import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1788982172515 implements MigrationInterface {
    name = 'InitSchema1788982172515'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."projetos_tipo_enum" AS ENUM('DOCUMENTARIO', 'FICÇÃO', 'ANIMAÇÃO')`);
        await queryRunner.query(`CREATE TABLE "projetos" ("id" SERIAL NOT NULL, "genero" character varying NOT NULL, "duracaoMin" integer NOT NULL, "orcamento" integer NOT NULL, "prazo" TIMESTAMP NOT NULL, "tipo" "public"."projetos_tipo_enum" NOT NULL, CONSTRAINT "PK_fb6b6aed4b30e10b976fe8bdf5b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "recomendacao" ("id" SERIAL NOT NULL, "projetoId" integer, CONSTRAINT "PK_bcb5e25a9fd4f9075d44ecd9ee0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "recomendacao_profissionais" ("Recomendacao" integer NOT NULL, "profissional" integer NOT NULL, "recomendacaoId" integer, "profissionalId" integer, CONSTRAINT "PK_7ad07815b241e0ccd066a2654e8" PRIMARY KEY ("Recomendacao", "profissional"))`);
        await queryRunner.query(`CREATE TABLE "competencias" ("id" SERIAL NOT NULL, "nome" character varying NOT NULL, CONSTRAINT "UQ_fe0116eb3d110a225b075a363c5" UNIQUE ("nome"), CONSTRAINT "PK_5200c17b2042a1db2e495f3af37" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "competencias_profissionais" ("id" SERIAL NOT NULL, "nivel" integer NOT NULL, "competenciaId" integer NOT NULL, "profissionalId" integer NOT NULL, CONSTRAINT "PK_47f1427ba9f85414c87156764df" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "profissional" ("id" SERIAL NOT NULL, "nome" character varying NOT NULL, "disponibilidadeInicio" TIMESTAMP NOT NULL, "disponibilidadeFinal" TIMESTAMP NOT NULL, "precoMedio" integer NOT NULL, CONSTRAINT "PK_2e385f6afaa389d36d3d718536f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "avaliacao" ("notaDoProfissional" integer NOT NULL, "comentario" character varying NOT NULL, "data" TIMESTAMP NOT NULL, "FKPROF" integer NOT NULL, "FKPROJ" integer NOT NULL, "papel" character varying NOT NULL, CONSTRAINT "CHK_16fd498ddc8664e10131a69d48" CHECK ("notaDoProfissional">0 AND "notaDoProfissional"<=5), CONSTRAINT "PK_6f1d55b84be72bad62fabb516fd" PRIMARY KEY ("FKPROF", "FKPROJ"))`);
        await queryRunner.query(`ALTER TABLE "recomendacao" ADD CONSTRAINT "FK_3d38a77ee1f9726285951e26725" FOREIGN KEY ("projetoId") REFERENCES "projetos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recomendacao_profissionais" ADD CONSTRAINT "FK_4332c82d55ac2bcd8ec330cb974" FOREIGN KEY ("recomendacaoId") REFERENCES "recomendacao"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recomendacao_profissionais" ADD CONSTRAINT "FK_f55a5aca3fbb0614276fd302607" FOREIGN KEY ("profissionalId") REFERENCES "profissional"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "competencias_profissionais" ADD CONSTRAINT "FK_d94d852c431003fd3c1d8b54968" FOREIGN KEY ("competenciaId") REFERENCES "competencias"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "competencias_profissionais" ADD CONSTRAINT "FK_90030102b0f2cb1bedb08a41b41" FOREIGN KEY ("profissionalId") REFERENCES "profissional"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "avaliacao" ADD CONSTRAINT "FK_61cbf0fa7d20733ebf227c0e87f" FOREIGN KEY ("FKPROF") REFERENCES "profissional"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "avaliacao" ADD CONSTRAINT "FK_fd4a6f1af3d8843f14b1a3c9d95" FOREIGN KEY ("FKPROJ") REFERENCES "projetos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "avaliacao" DROP CONSTRAINT "FK_fd4a6f1af3d8843f14b1a3c9d95"`);
        await queryRunner.query(`ALTER TABLE "avaliacao" DROP CONSTRAINT "FK_61cbf0fa7d20733ebf227c0e87f"`);
        await queryRunner.query(`ALTER TABLE "competencias_profissionais" DROP CONSTRAINT "FK_90030102b0f2cb1bedb08a41b41"`);
        await queryRunner.query(`ALTER TABLE "competencias_profissionais" DROP CONSTRAINT "FK_d94d852c431003fd3c1d8b54968"`);
        await queryRunner.query(`ALTER TABLE "recomendacao_profissionais" DROP CONSTRAINT "FK_f55a5aca3fbb0614276fd302607"`);
        await queryRunner.query(`ALTER TABLE "recomendacao_profissionais" DROP CONSTRAINT "FK_4332c82d55ac2bcd8ec330cb974"`);
        await queryRunner.query(`ALTER TABLE "recomendacao" DROP CONSTRAINT "FK_3d38a77ee1f9726285951e26725"`);
        await queryRunner.query(`DROP TABLE "avaliacao"`);
        await queryRunner.query(`DROP TABLE "profissional"`);
        await queryRunner.query(`DROP TABLE "competencias_profissionais"`);
        await queryRunner.query(`DROP TABLE "competencias"`);
        await queryRunner.query(`DROP TABLE "recomendacao_profissionais"`);
        await queryRunner.query(`DROP TABLE "recomendacao"`);
        await queryRunner.query(`DROP TABLE "projetos"`);
        await queryRunner.query(`DROP TYPE "public"."projetos_tipo_enum"`);
    }

}
