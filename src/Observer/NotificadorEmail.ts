import EventoRecomendacao from "./EventoRecomendacao";
import Observador from "./Observador";

export default class NotificadorEmail implements Observador{
    atualizar(evento: EventoRecomendacao): void {
         for(let profissional of evento.dados.membrosEquipe){
            console.log(`Enviando Emails para ${profissional.profissional.nome}`)
         }
    }
             
}