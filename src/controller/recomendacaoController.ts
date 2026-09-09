import { FastifyReply, FastifyRequest } from "fastify";
import ProfissionaisRepositorio from "../Repositorio/profissionaisRepositorio";
import ServiceRecomendacao from "../servico/ServiceRecomendacao";
import SistemaRecomendacao from "../SistemaRecomendacao/SistemaRecomendacao";
import Projeto from "../Projetos/Modelo/projetos";
import SimiliaridadeCosseno from "../Strategy/SimiliaridadedeCosseno";
import RecomendacaoStrategy from "../Strategy/RecomendacaoStrategy";
import FiltragemColaborativa from "../Strategy/FiltragemColaborativa";
import RegrasOrcamento from "../Strategy/RegrasOrcamento";
export const projetoRecomendacao={
    body:{
        type:'object',
        required:['id','genero','tipo','duracaoMin','orcamento','prazo','competencias','estrategia'],
        properties:{
            id:{type:'number'},
            genero:{
                type:'string',
                enum:['Comedia','AÇÃO','TERROR','DRAMA']
            },
            tipo:{
                type:'string',
                enum:['DOCUMENTARIO','FICÇÃO','ANIMAÇÃO']
            },
            duracaoMin:{
                type:'number'
            },
            orcamento:{
                type:'number'
            },
            prazo:{
                type:'string',
                format:'date-time'
            },
            comepetencias:{
                type:'object',
                required:['nome','nivel'],
                properties:{
                    nome:{
                        type:'string'
                    },
                    nivel:{
                        type:'number'
                    }
                }
            },
            estrategia:{
                type:'string'
            }

        }
        
    }
}
export class RecomendacaoController{
    private static sistemaRecomendacao= new SistemaRecomendacao()
    
    private static serviceRecomendacao=new ServiceRecomendacao(new ProfissionaisRepositorio(),RecomendacaoController.sistemaRecomendacao)
    
    static async Recomendar(request:FastifyRequest<{ Body: Projeto }>,reply:FastifyReply){
          try{
             const projeto=request.body
             let escolhaDeRecomendacao=projeto.estrategia
             let recomendacao:RecomendacaoStrategy;
             switch(escolhaDeRecomendacao){
                 case 'similiaridadecosseno':
                    recomendacao=new SimiliaridadeCosseno()
                    break;
                 case 'filtragemcolaborativa':
                     recomendacao=new FiltragemColaborativa()
                     break;
                 case 'regrasdeorcamento':
                     recomendacao=new RegrasOrcamento()
                     break
                 default:
                    recomendacao=new SimiliaridadeCosseno()
                    break;
             }
             const resultado=await RecomendacaoController.serviceRecomendacao.Recomendar(projeto,recomendacao)
               return reply.status(200).send({"Recomendacao":resultado})
          }catch(erro){
             console.log(erro)
            return reply.status(400).send({status:"error"})
          }
    }
}