import Projeto from "../../Projetos/Modelo/projetos";
import { Papel } from "../Enum/papel";
import OrquestradorEquipe from "./OrquestradorEquipe";
import Profissional from "./Profissional";

export default class OrquestradorPadrao extends OrquestradorEquipe{
    validarRestricoes(projeto: Projeto): boolean {
        throw new Error("Method not implemented.");
    }
    normalizarDados(projeto: Projeto): Array<Profissional> {
        throw new Error("Method not implemented.");
    }
    posProcessar(recomendacoes: Map<Papel, Profissional>): Map<Papel, Profissional> {
        throw new Error("Method not implemented.");
    }
    
}