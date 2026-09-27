import Equipe from "./equipe";
import Projeto from '../../Projetos/Modelo/projetos';
import Profissional from "./Profissional";
import { Papel } from "../Enum/papel";
import RecomendacaoStrategy from "../../Strategy/RecomendacaoStrategy"
export default abstract class OrquestradorEquipe{
       orquestrar(projeto:Projeto,estrategia:RecomendacaoStrategy,profissionais:Array<Profissional>):Equipe{
                  if (this.validarRestricoes(projeto)){
                     throw new Error("O projeto não possui competencias")
                  }
                   const equipe=this.normalizarDados(estrategia.recomendar(projeto,profissionais))
                    this.posProcessar(equipe)
                   return equipe
       }

       abstract  validarRestricoes(projeto:Projeto):boolean;

       abstract normalizarDados(profissionais:Map<Papel,Profissional>):Equipe;

       abstract posProcessar(recomendacao:Equipe):void;
}