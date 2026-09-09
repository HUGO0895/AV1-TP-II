import { Repository } from "typeorm";
import { Avaliacao } from "../Entidades/Avaliacao";
import { AppDataSource } from "../ConecBanco";

export default class AvaliacaoRepositorie extends Repository<Avaliacao>{
    constructor(){
        super(Avaliacao,AppDataSource.createEntityManager())
    }
}