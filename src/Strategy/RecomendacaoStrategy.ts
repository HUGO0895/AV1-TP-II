import { Papel } from "../Equipe/Enum/papel";
import Profissional from "../Equipe/Modelo/Profissional";
import Projeto from "../Projetos/Modelo/projetos";

export default interface RecomendacaoStrategy{
    recomendar(projeto:Projeto,profissionais:Array<Profissional>):Map<Papel,Profissional>
    
}