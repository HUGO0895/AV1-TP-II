import Equipe from "./equipe";
import Projeto from '../../Projetos/Modelo/projetos'
import Profissional from "./Profissional";
import { Papel } from "../Enum/papel";
import RecomendacaoStrategy from "../../Strategy/RecomendacaoStrategy"
export default abstract class OrquestradorEquipe{
       orquestrar(projeto:Projeto,estrategia:RecomendacaoStrategy):Equipe{
        
       }

       abstract  validarRestricoes(projeto:Projeto):boolean;

       abstract normalizarDados(projeto:Projeto):Array<Profissional>;

       abstract posProcessar(recomendacoes:Map<Papel,Profissional>):Map<Papel,Profissional>;


}