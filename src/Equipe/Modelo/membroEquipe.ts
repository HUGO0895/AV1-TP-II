import Profissional from "./Profissional"
import { Papel } from "../Enum/papel"
export default class MembroEquipe{
   public papel:Papel
   public confirmado:boolean
   public profissional:Profissional

   constructor(papel:Papel,confirmado:boolean,profissional:Profissional){
    this.papel=papel
    this.confirmado=confirmado
    this.profissional=profissional
   }
}
