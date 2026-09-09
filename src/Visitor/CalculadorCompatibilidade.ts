import Profissional from "../Equipe/Modelo/Profissional";
import Projeto from "../Projetos/Modelo/projetos";
import VisitanteProjeto from "./VisitanteProjeto";

export default class CalculadorCompatibilidade implements VisitanteProjeto{
    visitarProfissional(profissional: Profissional):number {
        return Math.floor(profissional.avaliacoes.reduce((acu,av)=>acu+av.notaDoProfissional,0)/profissional.avaliacoes.length)
    }

    visitarProjeto(projeto: Projeto):number[] {
        return projeto.equipe.membrosEquipe.map((mem)=>mem.profissional.avaliacoes.reduce((acu,av)=>acu+av.notaDoProfissional,0)/mem.profissional.avaliacoes.length)
    }
}