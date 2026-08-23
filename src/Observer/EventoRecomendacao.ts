import Equipe from "../Equipe/Modelo/equipe"

export default class EventoRecomendacao{
    tipo:string
    dados:Equipe
    origem:string
    constructor(tipo:string,dados:Equipe,origem:string){
           this.tipo=tipo
           this.origem=origem
           this.dados=dados
    }
}