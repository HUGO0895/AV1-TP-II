import Equipe from '../../Equipe/Modelo/equipe'
import Profissional from '../../Equipe/Modelo/Profissional'
import { Papel } from '../../Equipe/Enum/papel'
export default class Projeto{
     private id:string
     public genero:string
     public duracaoMin:number
     public orcamento:number
     public prazo:Date
     public equipe:Equipe

     constructor(id:string,genero:string,duracaoMin:number,orcamento:number,prazo:Date,equipe:Equipe){
          this.id=id
          this.genero=genero
          this.duracaoMin=duracaoMin
          this.orcamento=orcamento
          this.prazo=prazo
          this.equipe=equipe
     }

     public aceitarRecomendacao(papel:Papel,profissional:Profissional){

     }

     public substituirMembro(papel:Papel,profissional:Profissional){

     }

     public solicitarReavaliacao(){

     }
     
}