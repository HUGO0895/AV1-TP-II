import EventoRecomendacao from "./EventoRecomendacao";
import Observador from "./Observador";

export default class AuditoriaRecomendacao implements Observador{
    atualizar(evento: EventoRecomendacao): void {
        console.log("====LOG AUDITORIA: ====")
        console.log(`Dados:`)
        console.log(evento.dados.membrosEquipe)
        console.log("Origem:"+evento.origem) 
    
    }
    
}