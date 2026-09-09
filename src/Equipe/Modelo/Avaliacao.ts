import Projeto from "../../Projetos/Modelo/projetos"
import { Papel } from "../Enum/papel"

export default class Avaliacao{
public  notaDoProfissional:number
public comentario:string
public data:Date
public papel:Papel
public  ProjetoAvaliador:Projeto
constructor( notaDoProfissional:number,comentario:string,data:Date,papel:Papel,Projeto:Projeto){
    this. notaDoProfissional= notaDoProfissional
    this.comentario=comentario
    this.data=data
    this.papel=papel
    this.ProjetoAvaliador=Projeto
}

}