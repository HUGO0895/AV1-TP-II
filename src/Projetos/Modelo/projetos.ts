import Equipe from '../../Equipe/Modelo/equipe'
import Profissional from '../../Equipe/Modelo/Profissional'
import { Papel } from '../../Equipe/Enum/papel'
import { TipoProjeto } from '../Enum/TipoProjeto'
import { Genero } from '../Enum/TipoGenero'
import Competencias from '../../Equipe/Modelo/Competencias'
import ElementoVisitado from '../../Visitor/ElementoVisitado'
import VisitanteProjeto from '../../Visitor/VisitanteProjeto'
export default class Projeto implements ElementoVisitado{
     private id:string
     public genero:Genero
     public tipo:TipoProjeto
     public duracaoMin:number
     public orcamento:number
     public prazo:Date
     public equipe?:Equipe
     public competencias?:Map<Papel,Array<Competencias>>
     public estrategia?:string
     constructor(id:string,genero:Genero,duracaoMin:number,orcamento:number,prazo:Date,tipo:TipoProjeto,competencias?:Map<Papel,Array<Competencias>>,equipe?:Equipe,estrategia?:string){
          this.id=id
          this.genero=genero
          this.duracaoMin=duracaoMin
          this.orcamento=orcamento
          this.prazo=prazo
          this.equipe=equipe
          this.tipo=tipo
          this.competencias=competencias
          this.estrategia=estrategia
     }
     aceitar(visitante: VisitanteProjeto) {
          return visitante.visitarProjeto(this)
     }
}

{
     
}