import Profissional from "../Equipe/Modelo/Profissional";
import Projeto from "../Projetos/Modelo/projetos";
export default interface VisitanteProjeto{
    visitarProjeto(projeto:Projeto):any;
    visitarProfissional(profissional:Profissional):any;
}