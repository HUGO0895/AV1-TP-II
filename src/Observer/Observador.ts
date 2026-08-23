import EventoRecomendacao from "./EventoRecomendacao";

export default interface Observador{
    atualizar(evento:EventoRecomendacao):void;
}