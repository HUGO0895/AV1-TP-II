import { Papel } from "../Equipe/Enum/papel";
import Profissional from "../Equipe/Modelo/Profissional";
import Projeto from "../Projetos/Modelo/projetos";
import RecomendacaoStrategy from "./RecomendacaoStrategy";
import solver from "javascript-lp-solver";
export default class RegrasOrcamento implements RecomendacaoStrategy{
    recomendar(projeto: Projeto, profissionais: Array<Profissional>): Map<Papel, Profissional> {
        const MapaEquipe:Map<Papel, Profissional>=new Map()
        const model:any={
            optmize:"score",
            opType:"max",
            constraints:{
                orcamento:{max:projeto.orcamento},
                [Papel.DIRETOR]:{equal:1},
                [Papel.DIRETOR_FOTOGRAFIA]:{equal:1},
                [Papel.EDITOR]:{equal:1},
                [Papel.EFEITOS_VISUAIS]:{equal:1},
                [Papel.ROTEITISTA]:{equal:1},
                [Papel.SONOPLASTA]:{equal:1}},
            variables:{},
            ints:{}


        }
        for(const profissional of profissionais){
                let PapeisDeatuaçãoDoProfissional=[]
                PapeisDeatuaçãoDoProfissional=profissional.avaliacoes.map((avaliacao=>{
                    if(!PapeisDeatuaçãoDoProfissional.includes(avaliacao.papel)){
                        return avaliacao.papel
                    }
                    return ;
                }))
                const AvaliacaoMedia=Math.round(profissional.avaliacoes.reduce((acu,valor)=>acu+valor.notaDoProfissional,0)/profissional.avaliacoes.length)
                model.constraints[`${profissional.getId()}_max`]={max:1}
                for(const PapelDoProfissional of PapeisDeatuaçãoDoProfissional){
                    model.variables[`${profissional.getId()}_${PapelDoProfissional}`]={score:AvaliacaoMedia,orcamento:profissional.precoMedio,[PapelDoProfissional]:1,[`${profissional.getId()}_max`]:1}
                    model.ints[`${profissional.getId()}_${PapelDoProfissional}`]=1
                }
                

        }
      
        const resultado:any=solver.Solve(model);
        const {feasible,result,bounded,isIntegral,...profissionaisRescolhidos}=resultado
        for(let profissional of Object.keys(profissionaisRescolhidos)){
                const [id,papel]=profissional.split('_')
                const profissionalEscolhidoObjeto=profissionais.find((prof)=>prof.getId()===id)
                MapaEquipe.set(papel as Papel,profissionalEscolhidoObjeto)
        }
        return  MapaEquipe;
    }
    
}


