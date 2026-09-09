import { Entity,PrimaryGeneratedColumn,Column, OneToMany} from "typeorm";
import { TipoProjeto } from "../Projetos/Enum/TipoProjeto";
import { Avaliacao } from "./Avaliacao";
import { Recomendacao } from "./Recomendacao";



@Entity()
export class Projetos{
    @PrimaryGeneratedColumn()
    id:number;

    @Column({nullable:false})
    genero:string

    @Column({nullable:false})
    duracaoMin:number

    @Column({nullable:false})
    orcamento:number

    @Column({nullable:false})
    prazo:Date

    @Column({nullable:false,type:'enum',enum:TipoProjeto})
    tipo:TipoProjeto
    
    @OneToMany(()=>Avaliacao,(Avaliacao)=>Avaliacao.ProjetoAvaliador)
    Avalicao:Avaliacao[]

    @OneToMany(()=>Recomendacao,(Recomendacao)=>Recomendacao.projeto)
    recomendacoes:Recomendacao[]
}