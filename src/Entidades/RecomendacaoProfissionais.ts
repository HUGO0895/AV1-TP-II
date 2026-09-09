import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Recomendacao } from "./Recomendacao";
import { Profissional } from "./Profissionais";

@Entity()
export class RecomendacaoProfissionais {

    @PrimaryColumn({ name: 'recomendacaoId' })
    recomendacaoId: number

    
    @ManyToOne(() => Recomendacao, (Recomendacao) => Recomendacao.recomendacaoProfissionais)
    @JoinColumn({ name: 'recomendacaoId' })
    Recomendacao: Recomendacao

    @PrimaryColumn({ name: 'profissionalId' })
    profissionalIdPk: number

    @ManyToOne(() => Profissional, (Profissional) => Profissional.recomendacao)
    @JoinColumn({ name: 'profissionalId' })
    profissional: Profissional
}