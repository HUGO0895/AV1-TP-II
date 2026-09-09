import { Entity,PrimaryGeneratedColumn,Column, OneToMany} from "typeorm";
import { Competencias } from "./Competencias";
import { Avaliacao } from "./Avaliacao";
import { RecomendacaoProfissionais } from "./RecomendacaoProfissionais";
import { CompetenciasProfissionais } from "./CompetenciaProfissional";



@Entity()
export class Profissional{
     @PrimaryGeneratedColumn()
     id:number;

     @Column({nullable:false})
     nome:string

     @OneToMany(()=>CompetenciasProfissionais,(CompetenciasProfissionais)=>CompetenciasProfissionais.profissional,{eager:true})
     competencias:CompetenciasProfissionais[]

     @Column({nullable:false})
     disponibilidadeInicio:Date

     @Column({nullable:false})
     disponibilidadeFinal:Date

     @Column({nullable:false})
     precoMedio:number
     
     @OneToMany(()=>Avaliacao,(Avaliacao)=>Avaliacao.profissional,{eager:true})
     avaliacao:Avaliacao[]

     @OneToMany(()=>RecomendacaoProfissionais,(RecomendacaoProfissionais)=>RecomendacaoProfissionais.profissional)
     recomendacao:RecomendacaoProfissionais[]



}