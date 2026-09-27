import { Papel } from "../Equipe/Enum/papel";
import Avaliacao from "../Equipe/Modelo/Avaliacao";
import Competencias from "../Equipe/Modelo/Competencias";
import Equipe from "../Equipe/Modelo/equipe";
import Profissional from "../Equipe/Modelo/Profissional";
import { Genero } from "../Projetos/Enum/TipoGenero";
import { TipoProjeto } from "../Projetos/Enum/TipoProjeto";
import Projeto from "../Projetos/Modelo/projetos";
import RecomendacaoStrategy from "./RecomendacaoStrategy";

export default class FiltragemColaborativa implements RecomendacaoStrategy{
    recomendar(projeto: Projeto, profissionais: Array<Profissional>): Map<Papel, Profissional> {
             const mapaEquipe=new Map<Papel,Profissional>
             for(const competencia of projeto.competencias.keys()){
                if(mapaEquipe.size){
                      for(let chave of mapaEquipe.keys()){
                      
                      profissionais=profissionais.filter((profissional)=>(mapaEquipe.get(chave).getId()!==profissional.getId()))
                      
                      }
                    }
                const ArrayDasMediaPorPapel:Array<{prof:Profissional,media:number}>=[]
                for (const profissional of profissionais ){
               
                   const filtrandoNotasPeloPapelAvaliado= profissional.avaliacoes.filter((avaliacao)=>avaliacao.papel===competencia)
                   const media=Math.round(filtrandoNotasPeloPapelAvaliado.reduce((acu,avaliacao)=>acu+avaliacao.notaDoProfissional,0)/filtrandoNotasPeloPapelAvaliado.length)
                   ArrayDasMediaPorPapel.push({prof:profissional,media:media})

                }
                const maisQualificado=ArrayDasMediaPorPapel.reduce((max,atual)=>atual.media>max.media ? atual:max)
            
                mapaEquipe.set(competencia as Papel,maisQualificado.prof)

                
    }
    return mapaEquipe

    
    
}
}

