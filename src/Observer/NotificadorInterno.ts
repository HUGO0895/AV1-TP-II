import EventoRecomendacao from "./EventoRecomendacao";
import Observador from "./Observador";

export default class NotificadorInterno implements Observador{
    atualizar(evento: EventoRecomendacao): void {
        console.log("====NOTIFICADOR-INTERNO====")
          console.log("Enviando dados para serviços internos")
    }

}