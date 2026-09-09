import Profissional from "../Equipe/Modelo/Profissional";
import { Genero } from "../Projetos/Enum/TipoGenero";
import Projeto from "../Projetos/Modelo/projetos";
import ProfissionaisRepositorio from "../Repositorio/profissionaisRepositorio";
import SistemaRecomendacao from "../SistemaRecomendacao/SistemaRecomendacao";
import RecomendacaoStrategy from "../Strategy/RecomendacaoStrategy";
import Equipe from "../Equipe/Modelo/equipe";
export default class ServiceRecomendacao{
    
    constructor(
        private ProfissionalRepositorio:ProfissionaisRepositorio,
        private SistemaDeRecomendacao:SistemaRecomendacao
    ){}
    
    public async Recomendar(projeto:Projeto,estrategia:RecomendacaoStrategy){
     const profissionais=(await this.ProfissionalRepositorio.find()).map((prof)=>(
      new Profissional(prof.id.toString(),prof.nome,
        prof.competencias.map((cp) => ({
                nome: cp.competencia.nome,
                nivel: cp.nivel
            })),{inicio:prof.disponibilidadeInicio,final:prof.disponibilidadeFinal},prof.precoMedio,prof.avaliacao.map((av)=>({
                notaDoProfissional:av.notaDoProfissional,
                comentario:av.comentario,
                data:av.data,
                papel:av.papel,
                ProjetoAvaliador:new Projeto(av.ProjetoAvaliador.id.toString(),av.ProjetoAvaliador.genero as Genero,av.ProjetoAvaliador.duracaoMin,av.ProjetoAvaliador.orcamento,av.ProjetoAvaliador.prazo,av.ProjetoAvaliador.tipo)
            })))
     ))
     this.SistemaDeRecomendacao.definirEstrategiaAtual(estrategia)
     const equipe=this.SistemaDeRecomendacao.executarEstrategia(projeto,profissionais)
     return equipe;
    }
}   