import Projeto from "../../Projetos/Modelo/projetos";
import { Papel } from "../Enum/papel";
import Equipe from "./equipe";
import MembroEquipe from "./membroEquipe";
import OrquestradorEquipe from "./OrquestradorEquipe";
import Profissional from "./Profissional";

export default class OrquestradorPadrao extends OrquestradorEquipe{
    validarRestricoes(projeto: Projeto): boolean {
        return  'competencias' in projeto
    }
    normalizarDados(profissionais:Map<Papel,Profissional>):Equipe{
            let membrosEquipe:Array<MembroEquipe>=[]
            for(const [papel,Profissional] of profissionais){
                 const membrodaEquipe=new MembroEquipe(papel,true,Profissional)
                 membrosEquipe.push(membrodaEquipe)
            }
            return new Equipe(new Date(),'formada',membrosEquipe)
    }
    posProcessar(recomendacao:Equipe):void{
         console.log("Processando:")
         console.log(recomendacao)
    }
    
    
}