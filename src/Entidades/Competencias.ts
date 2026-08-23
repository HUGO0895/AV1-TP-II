import { Entity,PrimaryGeneratedColumn,Column, ManyToOne} from "typeorm";
import { Profissional } from "./Profissionais";


@Entity()

export class Competencias{
    @PrimaryGeneratedColumn()
    id:number 
    
    @Column({nullable:false})
    nome:string 

    @Column({nullable:false})
    nivel:number

    @ManyToOne(()=>Profissional,(Profissional)=>Profissional.competencias)
    profissional:Profissional

}