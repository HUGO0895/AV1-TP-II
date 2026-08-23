import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Profissional } from "./Profissionais";


@Entity()

export class Avaliacao{
     @PrimaryGeneratedColumn()
     id:number

     @Column({nullable:false})
     nota:number
     
     @Column({nullable:false})
     comentario:string 

     @Column({nullable:false})
     data:Date

     @ManyToOne(()=>Profissional,(Profissional)=>Profissional.avaliacao)
     profissional:Profissional
}