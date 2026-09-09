import { Entity,PrimaryGeneratedColumn,Column, ManyToOne, OneToMany} from "typeorm";
import { Profissional } from "./Profissionais";
import { CompetenciasProfissionais } from "./CompetenciaProfissional";


@Entity()

export class Competencias{
    @PrimaryGeneratedColumn()
    id:number 
    
    @Column({nullable:false,unique:true})
    nome:string 

    @OneToMany(()=>CompetenciasProfissionais,(CompetenciasProfissionais)=>CompetenciasProfissionais.competencia)
    competenciasProfssionais:CompetenciasProfissionais[]



}