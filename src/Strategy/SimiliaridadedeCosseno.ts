import { Papel } from "../Equipe/Enum/papel";
import Profissional from "../Equipe/Modelo/Profissional";
import Projeto from "../Projetos/Modelo/projetos";
import RecomendacaoStrategy from "./RecomendacaoStrategy";

export default class SimiliaridadeCosseno implements RecomendacaoStrategy{
    recomendar(projeto: Projeto, profissionais: Array<Profissional>): Map<Papel, Profissional> {
        throw new Error("Method not implemented.");
    }
    
}