import EventoRecomendacao from "./EventoRecomendacao";
import Observador from "./Observador";

export default class AuditoriaRecomendacao implements Observador{
    atualizar(evento: EventoRecomendacao): void {
        console.log("LOG AUDITORIA: "+"Tipo:"+evento.tipo+`\nDados:`+evento.dados+"\nOrigem:"+evento.origem)
    }
    
}