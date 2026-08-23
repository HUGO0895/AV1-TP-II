import OrquestradorEquipe from "../Equipe/Modelo/OrquestradorEquipe";
import EventoRecomendacao from "../Observer/EventoRecomendacao";
import Observador from "../Observer/Observador";
import RecomendacaoStrategy from "../Strategy/RecomendacaoStrategy";

export default class SistemaRecomendacao{
    private Observadores:Array<Observador>
    private EstrategiaAtual:RecomendacaoStrategy
    private Orquestrador:OrquestradorEquipe

   public definirEstrategiaAtual(estrategia:RecomendacaoStrategy){
             this.EstrategiaAtual=estrategia
   }

   public executarEstrategia(){
     const Equipe= this.Orquestrador.orquestrar()
     this.notificar(new EventoRecomendacao("Recomendação de Equipe",Equipe,"Sistema Recomendação"))
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