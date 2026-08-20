import { Intervalo } from "../Types/intervalo"
import Competencias from "./Competencias"
export default class Profissional{
     private id:string
     public nome:string
     public competencias:Array<Competencias>
     public disponibiliade:Intervalo
     public precoMedio:number
     constructor(id:string,nome:string,competencias:Array<Competencias>,disponibiliade:Intervalo,precoMedio:number){
        this.id=id
        this.nome=nome
        this.competencias=competencias
        this.disponibiliade=disponibiliade
        this.precoMedio=precoMedio
     }
}