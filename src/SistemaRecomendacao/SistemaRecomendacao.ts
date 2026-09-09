import OrquestradorEquipe from "../Equipe/Modelo/OrquestradorEquipe";
import OrquestradorPadrao from "../Equipe/Modelo/OrquestradorPadrao";
import Profissional from "../Equipe/Modelo/Profissional";
import AuditoriaRecomendacao from "../Observer/AuditoriaRecomendacao";
import EventoRecomendacao from "../Observer/EventoRecomendacao";
import NotificadorEmail from "../Observer/NotificadorEmail";
import NotificadorInterno from "../Observer/NotificadorInterno";
import Observador from "../Observer/Observador";
import Projeto from "../Projetos/Modelo/projetos";
import RecomendacaoStrategy from "../Strategy/RecomendacaoStrategy";

export default class SistemaRecomendacao{
    private Observadores:Array<Observador>=[new NotificadorEmail(),new NotificadorInterno(),new AuditoriaRecomendacao()]
    private EstrategiaAtual:RecomendacaoStrategy
    private Orquestrador=new OrquestradorPadrao()

   public definirEstrategiaAtual(estrategia:RecomendacaoStrategy){
             this.EstrategiaAtual=estrategia
   }

   public executarEstrategia(projeto:Projeto,profissionais:Array<Profissional>){
     const Equipe= this.Orquestrador.orquestrar(projeto,this.EstrategiaAtual,profissionais)
     this.notificar(new EventoRecomendacao("Recomendação de Equipe",Equipe,"Sistema Recomendação"))
     return Equipe
   }

   public adicionarObeservador(observador:Observador){
            this.Observadores.push(observador)
   }

   private notificar(evento:EventoRecomendacao){
        for (let x of this.Observadores){
            x.atualizar(evento)
        }
   }
}