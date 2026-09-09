import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1788982279683 implements MigrationInterface {
    name = 'InitSchema1788982279683'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recomendacao_profissionais" DROP CONSTRAINT "PK_7ad07815b241e0ccd066a2654e8"`);
        await queryRunner.query(`ALTER TABLE "recomendacao_profissionais" ADD CONSTRAINT "PK_7f52c96de0b21283f0fb3b91c2c" PRIMARY KEY ("profissional")`);
        await queryRunner.query(`ALTER TABLE "recomendacao_profissionais" DROP COLUMN "Recomendacao"`);
        await queryRunner.query(`ALTER TABLE "recomendacao_profissionais" DROP CONSTRAINT "PK_7f52c96de0b21283f0fb3b91c2c"`);
        await queryRunner.query(`ALTER TABLE "recomendacao_profissionais" DROP COLUMN "profissional"`);
        await queryRunner.query(`ALTER TABLE "recomendacao_profissionais" ADD CONSTRAINT "PK_356ee8d6203a9f3e509aa2e665d" PRIMARY KEY ("recomendacaoId", "profissionalId")`);
        await queryRunner.query(`ALTER TABLE "recomendacao_profissionais" DROP CONSTRAINT "FK_4332c82d55ac2bcd8ec330cb974"`);
        await queryRunner.query(`ALTER TABLE "recomendacao_profissionais" DROP CONSTRAINT "FK_f55a5aca3fbb0614276fd302607"`);
        await queryRunner.query(`ALTER TABLE "recomendacao_profissionais" ALTER COLUMN "recomendacaoId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "recomendacao_profissionais" ALTER COLUMN "profissionalId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "recomendacao_profissionais" ADD CONSTRAINT "FK_4332c82d55ac2bcd8ec330cb974" FOREIGN KEY ("recomendacaoId") REFERENCES "recomendacao"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recomendacao_profissionais" ADD CONSTRAINT "FK_f55a5aca3fbb0614276fd302607" FOREIGN KEY ("profissionalId") REFERENCES "profissional"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recomendacao_profissionais" DROP CONSTRAINT "FK_f55a5aca3fbb0614276fd302607"`);
        await queryRunner.query(`ALTER TABLE "recomendacao_profissionais" DROP CONSTRAINT "FK_4332c82d55ac2bcd8ec330cb974"`);
        await queryRunner.query(`ALTER TABLE "recomendacao_profissionais" ALTER COLUMN "profissionalId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "recomendacao_profissionais" ALTER COLUMN "recomendacaoId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "recomendacao_profissionais" ADD CONSTRAINT "FK_f55a5aca3fbb0614276fd302607" FOREIGN KEY ("profissionalId") REFERENCES "profissional"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recomendacao_profissionais" ADD CONSTRAINT "FK_4332c82d55ac2bcd8ec330cb974" FOREIGN KEY ("recomendacaoId") REFERENCES "recomendacao"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recomendacao_profissionais" DROP CONSTRAINT "PK_356ee8d6203a9f3e509aa2e665d"`);
        await queryRunner.query(`ALTER TABLE "recomendacao_profissionais" ADD "profissional" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "recomendacao_profissionais" ADD CONSTRAINT "PK_7f52c96de0b21283f0fb3b91c2c" PRIMARY KEY ("profissional")`);
        await queryRunner.query(`ALTER TABLE "recomendacao_profissionais" ADD "Recomendacao" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "recomendacao_profissionais" DROP CONSTRAINT "PK_7f52c96de0b21283f0fb3b91c2c"`);
        await queryRunner.query(`ALTER TABLE "recomendacao_profissionais" ADD CONSTRAINT "PK_7ad07815b241e0ccd066a2654e8" PRIMARY KEY ("Recomendacao", "profissional")`);
    }

}
