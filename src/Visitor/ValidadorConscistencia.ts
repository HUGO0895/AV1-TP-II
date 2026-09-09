import Profissional from "../Equipe/Modelo/Profissional";
import Projeto from "../Projetos/Modelo/projetos";
import VisitanteProjeto from "./VisitanteProjeto";

export default class ValidadorConscistencia implements VisitanteProjeto{
    visitarProfissional(profissional: Profissional):boolean {
         return profissional.competencias.length>0
    }

    visitarProjeto(projeto: Projeto):boolean {
        return projeto.equipe.membrosEquipe.length>0
    }
}