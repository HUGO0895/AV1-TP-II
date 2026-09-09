import ElementoVisitado from "../../Visitor/ElementoVisitado"
import VisitanteProjeto from "../../Visitor/VisitanteProjeto"
import { Intervalo } from "../Types/intervalo"
import Avaliacao from "./Avaliacao"
import Competencias from "./Competencias"
export default class Profissional implements ElementoVisitado{
     private id:string
     public nome:string
     public competencias:Array<Competencias>
     public disponibiliade:Intervalo
     public precoMedio:number
     public avaliacoes:Array<Avaliacao>
     constructor(id:string,nome:string,competencias:Array<Competencias>,disponibiliade:Intervalo,precoMedio:number,avaliacoes:Array<Avaliacao>){
        this.id=id
        this.nome=nome
        this.competencias=competencias
        this.disponibiliade=disponibiliade
        this.precoMedio=precoMedio
        this.avaliacoes=avaliacoes
     }
   aceitar(visitante: VisitanteProjeto) {
      return visitante.visitarProfissional(this)
   }

     public getId(){
      return this.id
     }
}