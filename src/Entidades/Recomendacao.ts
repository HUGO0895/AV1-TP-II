import { Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Projetos } from "./Projeto";
import { RecomendacaoProfissionais } from "./RecomendacaoProfissionais";


@Entity()
export class Recomendacao{
    @PrimaryGeneratedColumn()
    id:number 

    @ManyToOne(()=>Projetos,(Projetos)=>Projetos.recomendacoes)
    projeto:Projetos
    
    @OneToMany(()=>RecomendacaoProfissionais,(RecomendacaoProfissionais)=>RecomendacaoProfissionais.Recomendacao)
    recomendacaoProfissionais:RecomendacaoProfissionais[]

}