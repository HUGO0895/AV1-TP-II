import Profissional from "../Equipe/Modelo/Profissional";
import Projeto from "../Projetos/Modelo/projetos";
import VisitanteProjeto from "./VisitanteProjeto";

export default class GeradorRelatorio implements VisitanteProjeto{
    visitarProfissional(profissional: Profissional):string {
        return `Profissional: ${profissional.nome} | Preço médio: ${profissional.precoMedio} | ` +
         `Disponibilidade: ${profissional.disponibiliade.inicio} a ${profissional.disponibiliade.final} | ` +
         `Competências: ${profissional.competencias.length} | Avaliações: ${profissional.avaliacoes.length}`
   
        
    }

    visitarProjeto(projeto: Projeto):string {
        return `Projeto: ${projeto.tipo} (${projeto.genero}) | Duração mín: ${projeto.duracaoMin} | ` +
             `Orçamento: ${projeto.orcamento} | Prazo: ${projeto.prazo.toLocaleDateString()} | ` +
             `Equipe: ${projeto.equipe.membrosEquipe}}`
    }
}