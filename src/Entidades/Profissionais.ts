import { Entity,PrimaryGeneratedColumn,Column, OneToMany} from "typeorm";
import { Competencias } from "./Competencias";
import { Avaliacao } from "./Avaliacao";



@Entity()
export class Profissional{
     @PrimaryGeneratedColumn()
     id:number;

     @Column({nullable:false})
     nome:string

     @OneToMany(()=>Competencias,(Competencias)=>Competencias.profissional,{eager:true})
     competencias:Competencias

     @Column({nullable:false})
     disponibilidadeInicio:Date

     @Column({nullable:false})
     disponibilidadeFinal:Date

     @Column({nullable:false})
     precoMedio:number
     
     @OneToMany(()=>Avaliacao,(Avaliacao)=>Avaliacao.profissional)
     avaliacao:Avaliacao



}