import { Entity,PrimaryGeneratedColumn,Column, ManyToOne} from "typeorm";
import { Profissional } from "./Profissionais";
import { Competencias } from "./Competencias";


@Entity()

export class CompetenciasProfissionais{
    @PrimaryGeneratedColumn()
    id:number 
    
    @ManyToOne(()=>Competencias,(Competencias)=>Competencias.competenciasProfssionais,{nullable:false,eager:true})
    competencia:Competencias

    @Column({nullable:false})
    nivel:number

    @ManyToOne(()=>Profissional,(Profissional)=>Profissional.competencias,{nullable:false})
    profissional:Profissional


}