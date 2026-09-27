import { Papel } from "../Equipe/Enum/papel";
import Profissional from "../Equipe/Modelo/Profissional";
import Projeto from "../Projetos/Modelo/projetos";
import RecomendacaoStrategy from "./RecomendacaoStrategy";
import solver from "javascript-lp-solver";

export default class RegrasOrcamento implements RecomendacaoStrategy {
    recomendar(projeto: Projeto, profissionais: Array<Profissional>): Map<Papel, Profissional> {
        const MapaEquipe: Map<Papel, Profissional> = new Map()
        const model: any = {
            optimize: "score", 
            opType: "max",
            constraints: {
                orcamento: { max: projeto.orcamento },
            },
            variables: {},
            ints: {}
        }

        for (const papel of projeto.competencias.keys()) {
            model.constraints[papel] = { equal: 1 }
        }

        const papeisPedidosPeloProjeto = new Set(projeto.competencias.keys())

        for (const profissional of profissionais) {
            const PapeisDeatuaçãoDoProfissional = Array.from(
                new Set(
                    profissional.avaliacoes
                        .map((avaliacao) => avaliacao.papel)
                        .filter((papel) => papeisPedidosPeloProjeto.has(papel))
                )
            )
            if (PapeisDeatuaçãoDoProfissional.length === 0) continue
            const AvaliacaoMedia = Math.round(profissional.avaliacoes.reduce((acu, valor) => acu + valor.notaDoProfissional, 0) / profissional.avaliacoes.length)
            model.constraints[`${profissional.getId()}_max`] = { max: 1 }
            for (const PapelDoProfissional of PapeisDeatuaçãoDoProfissional) {
                model.variables[`${profissional.getId()}_${PapelDoProfissional}`] = { score: AvaliacaoMedia, orcamento: profissional.precoMedio, [PapelDoProfissional]: 1, [`${profissional.getId()}_max`]: 1 }
                model.ints[`${profissional.getId()}_${PapelDoProfissional}`] = 1
            }
        }
        const resultado: any = solver.Solve(model);
        const { feasible, result, bounded, isIntegral, ...profissionaisRescolhidos } = resultado
        for (let profissional of Object.keys(profissionaisRescolhidos)) {
            if (profissionaisRescolhidos[profissional] !== 1) continue
            const [id, papel] = profissional.split('_')
            const profissionalEscolhidoObjeto = profissionais.find((prof) => prof.getId() === id)
            MapaEquipe.set(papel as Papel, profissionalEscolhidoObjeto)
        }
        return MapaEquipe;
    }
}