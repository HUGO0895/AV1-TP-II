import { Check, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Profissional } from "./Profissionais";
import { Projetos } from "./Projeto";
import { Papel } from "../Equipe/Enum/papel";

@Entity()
@Check(`"notaDoProfissional">0 AND "notaDoProfissional"<=5`)
export class Avaliacao {

    @Column({ nullable: false })
    notaDoProfissional: number

    @Column({ nullable: false })
    comentario: string

    @Column({ nullable: false })
    data: Date

  
    @PrimaryColumn({ name: 'FKPROF' })
    profissionalId: number

    @ManyToOne(() => Profissional, (Profissional) => Profissional.avaliacao)
    @JoinColumn({ name: 'FKPROF' })
    profissional: Profissional

    @PrimaryColumn({ name: 'FKPROJ' })
    projetoAvaliadorId: number

    @ManyToOne(() => Projetos, (Projetos) => Projetos.Avalicao, { eager: true })
    @JoinColumn({ name: 'FKPROJ' })
    ProjetoAvaliador: Projetos

    @PrimaryColumn()
    @Column({ nullable: false })
    papel: Papel
}